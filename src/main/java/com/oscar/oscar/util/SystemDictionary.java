package com.oscar.oscar.util;

public class SystemDictionary {

	public static class FilePath {

		/**
		 * 
		 * 订单上传路径
		 */
		// FIXME 修改文件路径
		 public static final String UPLOAD_FILE_ORDER_PATH="d:\\";
//		public static final String UPLOAD_FILE_ORDER_PATH = "/home/tb_file/upload";

		/**
		 * 生成订单存放路径
		 */
		// FIXME 修改文件路径
		 public static final String
		 DOWNLOAD_FILE_ORDER_PATH="d:\\tb_download\\";
//		public static final String DOWNLOAD_FILE_ORDER_PATH = "/home/tb_file/download";

	}

	/**
	 * 采购单状态
	 * 
	 * @author liujunhao
	 *
	 */
	public static class PurchaseOrderState {
		/**
		 * 新生成
		 */
		public static String NEW_ORDER = "A";//
		/**
		 * 未发货
		 */
		public static String NOT_SENT = "B";
		/**
		 * 发货中
		 */
		public static String DELEVERING = "C";//
		/**
		 * 已到货
		 */
		public static String ARRIVED = "D";//
		/**
		 * 入库中
		 */
		public static String STORING = "E";//
		/**
		 * 已入库
		 */
		public static String STORED = "F";//
		/**
		 * 审核状态
		 */
		public static String REVIEW = "G";//

	}

}
