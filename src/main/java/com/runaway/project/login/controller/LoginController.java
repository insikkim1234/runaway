package com.runaway.project.login.controller;

import com.runaway.project.login.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
public class LoginController {
    @Autowired
    private LoginService loginService;

    @GetMapping("/oauth2/token")
    public OAuth2Token getLogin(@RequestParam("code") String code) {
        OAuth2Token oAuth2Token = loginService.getAccessToken(code);

        System.out.println(oAuth2Token.toString());
        return oAuth2Token;
    }
}
