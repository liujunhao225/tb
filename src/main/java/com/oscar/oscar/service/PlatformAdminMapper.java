package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.PlatformAdminBean;

public interface PlatformAdminMapper {

	public List<PlatformAdminBean> getUserList(@Param(value="userName")String userName,RowBounds rowbounds);
    public int getUserCount(@Param(value="userName")String userName);
    public PlatformAdminBean getUserByUserName(@Param(value="userName")String userName);
    public int addUser(PlatformAdminBean user);
    public int updateUser(PlatformAdminBean user);
    public int delectUser(@Param(value="userName")String userName);
}
