<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreServiceFactory" %>
<%@ page import="com.google.appengine.api.datastore.DatastoreService" %>
<%@ page import="com.google.appengine.api.datastore.Query" %>
<%@ page import="com.google.appengine.api.datastore.Entity" %>
<%@ page import="com.google.appengine.api.datastore.FetchOptions" %>
<%@ page import="com.google.appengine.api.datastore.Key" %>
<%@ page import="com.google.appengine.api.datastore.KeyFactory" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html>
	<head>
    	<link type="text/css" rel="stylesheet" href="/stylesheets/main.css" />
    	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&key=&sensor=true">
    	</script>  	
            <script type="text/javascript" src="guestbook_map.js">
        </script> 
  	</head>
    <body>


<%
    String guestbookName = request.getParameter("guestbookName");
    if (guestbookName == null) {
        guestbookName = "default";
    }
    pageContext.setAttribute("guestbookName", guestbookName);
    UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();
    if (user != null) {
      pageContext.setAttribute("user", user);
%>

<p class="greeting">Hello, ${fn:escapeXml(user.nickname)}! (You can
<a href="<%= userService.createLogoutURL(request.getRequestURI()) %>">sign out</a>.)</p>

<%
    } else {
%>
<p class="greeting">Hello!
<a href="<%= userService.createLoginURL(request.getRequestURI()) %>">Sign in</a>
to include your name with greetings you post.</p>

<%
    }
%>

<%
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key guestbookKey = KeyFactory.createKey("Guestbook", guestbookName);
    // Run an ancestor query to ensure we see the most up-to-date
    // view of the Greetings belonging to the selected Guestbook.
    Query query = new Query("Greeting", guestbookKey).addSort("date", Query.SortDirection.DESCENDING);
    List<Entity> greetings = datastore.prepare(query).asList(FetchOptions.Builder.withLimit(10));
    if (greetings.isEmpty()) {
        %>
        <p>Guestbook '${fn:escapeXml(guestbookName)}' has no messages.</p>
        <%
    } else {
        %>
        <p>Messages in Guestbook '${fn:escapeXml(guestbookName)}'.</p>
        <%
        	for (Entity greeting : greetings) {
                    pageContext.setAttribute("greeting_content",
                                             greeting.getProperty("content"));               
                    pageContext.setAttribute("greeting_latitude",
                            				(greeting.getProperty("latitude")==null? "0": greeting.getProperty("latitude")));
        			pageContext.setAttribute("greeting_longitude",
        									(greeting.getProperty("longitude")==null? "0": greeting.getProperty("longitude")));
        			pageContext.setAttribute("greeting_accuracy",
        									(greeting.getProperty("accuracy")==null? "0": greeting.getProperty("accuracy")));

        			if (greeting.getProperty("user") == null) {
        %>
                <p>An anonymous person wrote:</p>
                <%
            } else {
                pageContext.setAttribute("greeting_user",
                                         greeting.getProperty("user"));
                %>
                <p><b>${fn:escapeXml(greeting_user.nickname)}</b> wrote:</p>
                <%
            }
            %>
            <blockquote>${fn:escapeXml(greeting_content)}</blockquote>
            <p>(Written at location: ${fn:escapeXml(greeting_latitude)},  ${fn:escapeXml(greeting_longitude)}.
            Accuracy: ${fn:escapeXml(greeting_accuracy)} meters)
            </p>
            
            <script type = "text/javascript" >
    			addMarker(80, -180, "TEST!!");
    		</script>  	
            <%
        }
    }
%>

    <form action="/sign" method="post">
      <div><textarea name="content" rows="5" cols="60"></textarea></div>
      <div><input type="submit" value="Post Greeting" /></div>
      <input type="hidden" name="guestbookName" value="${fn:escapeXml(guestbookName)}"/>
      <input type="hidden" id="latitude" name="latitude" value="0"/>
      <input type="hidden" id="longitude" name="longitude" value="0"/>
      <input type="hidden" id="accuracy" name="accuracy" value="0"/>
    </form>
    
    <div id="map-canvas"> </div>
    

  </body>
</html>