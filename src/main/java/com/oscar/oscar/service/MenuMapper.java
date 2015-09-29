package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.oscar.oscar.bean.MenuBean;

public interface MenuMapper {

	public List<MenuBean> getAdminMenu(
			@Param(value = "userName") String userName);

	/**
	 * 取得子菜单
	 * 
	 * @param fId
	 * @return
	 */
	public List<MenuBean> getsubMenu(Integer fId);

	public void removerMenu(String userName);

	public int addAdminMenu(List<MenuBean> list);

}
