/**
 * Author:liujunhao
 * Date:2015-09-29
 * Note:生成下载文件，返回下载文件名
 */
package com.oscar.oscar.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import com.oscar.oscar.bean.ShopOrderBean;

public class OrderFileMakerTool {

	private static Logger logger = Logger.getLogger(OrderFileMakerTool.class
			.getCanonicalName());

	/**
	 * 
	 * @param fileName
	 *            @
	 * @return
	 */
	public static String makeExcel(String fileName,
			Map<String, ShopOrderBean> map) {

		logger.info("【导出文件】打开原始文件");
		Workbook workbook = null;
		try {
			workbook = WorkbookFactory
					.create(new File(
							SystemDictionary.FilePath.UPLOAD_FILE_ORDER_PATH
									+ fileName));
			Sheet sheet = workbook.getSheetAt(0);
			sheet.setDefaultRowHeight((short) 1000);
			int maxRowNum = sheet.getLastRowNum();
			// 取得订单编号的列索引
			int columnNum = sheet.getRow(0).getLastCellNum();

			int orderIdColumnIndex = 200;
			int changweiColumnIdex = 200;
			int changkuColumnIndex = 200;
			int existColumnIndex = 200;

			Row titleRow = sheet.getRow(0);
			for (int i = 0; i < columnNum; i++) {
				titleRow.getCell(i).setCellType(Cell.CELL_TYPE_STRING);
				String cellValue = titleRow.getCell(i).getStringCellValue();
				if ("订单编号".equals(cellValue)) {
					orderIdColumnIndex = i;
				} else if ("仓位".equals(cellValue)) {
					changweiColumnIdex = i;
				} else if ("渠道优化".equals(cellValue)) {
					changkuColumnIndex = i;
				} else if ("是否有货".equals(cellValue)) {
					existColumnIndex = i;
				}
			}
			// 获取
			for (int i = 1; i < maxRowNum; i++) {
				String tempOrderId = sheet.getRow(i)
						.getCell(orderIdColumnIndex).getStringCellValue();
				ShopOrderBean temporderBean = map.get(tempOrderId);
				if(temporderBean==null)
					continue;
				// 仓库
				if (sheet.getRow(i).getCell(changkuColumnIndex) == null)
					sheet.getRow(i).createCell(changkuColumnIndex)
							.setCellValue(temporderBean.getChannel());
				else 
					sheet.getRow(i).getCell(changkuColumnIndex)
					.setCellValue(temporderBean.getChannel());
				// 仓位
				if (sheet.getRow(i).getCell(changweiColumnIdex) == null)
					sheet.getRow(i).createCell(changweiColumnIdex)
							.setCellValue(temporderBean.getStorePlace());
				else 
					sheet.getRow(i).getCell(changweiColumnIdex)
					.setCellValue(temporderBean.getStorePlace());
				// 是否有货
				String ishaving = "1".equals(temporderBean
						.getIsHaveProductFlag()) ? "有" : "无";
				sheet.getRow(i).createCell(existColumnIndex)
						.setCellValue(ishaving);
				// sheet.getRow(i).getCell(existColumnIndex).setCellValue(ishaving);
			}
			FileOutputStream fileOut = new FileOutputStream(
					SystemDictionary.FilePath.DOWNLOAD_FILE_ORDER_PATH
							+ fileName);
			workbook.write(fileOut);
			fileOut.close();
		} catch (InvalidFormatException e) {
			logger.error("【导出文件】excel文件格式 不正确");
			e.printStackTrace();
			return "";
		} catch (IOException e) {
			logger.error("【导出文件】excel文件IO异常");
			e.printStackTrace();
			return "";
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return "";
		} finally {

		}
		return SystemDictionary.FilePath.DOWNLOAD_FILE_ORDER_PATH + fileName;
	}

}
