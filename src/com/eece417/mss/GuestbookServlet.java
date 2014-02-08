package com.eece417.mss;

import java.io.IOException;
import javax.servlet.http.*;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

@SuppressWarnings("serial")
public class GuestbookServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		
		if( user != null){
			resp.setContentType("text/plain");
			resp.getWriter().println("Hello, " + user.getNickname());
		}else{
			//  Sends a temporary redirect response to the client using the 
			// specified redirect location URL and clears the buffer.
			resp.sendRedirect(userService.createLoginURL(req.getRequestURI()));
		}
		
	}
}
