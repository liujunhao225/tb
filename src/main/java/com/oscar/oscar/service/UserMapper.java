package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.User;

public interface UserMapper {

	public List<User> getUserList(RowBounds rowbounds, User user);

	public User getUser(String username);
	
	public int changePsd(String password);

}
