package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.ShopOrderUploadBean;

public interface ShopOrderUploadMapper {
	public List<ShopOrderUploadBean> getShopOrderUploadList(@Param(value="fileName")String fileName,RowBounds rowbounds);
	public int getShopOrderUploadCount(@Param(value="fileName")String fileName);
	public int addShopOrderFile(ShopOrderUploadBean bean);
	public ShopOrderUploadBean getShopOrderFileById(@Param(value="id")String id);
	public int updategetShopOrderFileMatchStatus(@Param(value="id")String id,@Param(value="isMath")String isMath);
	public int delShopOrderUploadFile(@Param(value="id")String id);
}
