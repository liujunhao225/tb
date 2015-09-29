package com.oscar.oscar.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MD5加密工具
 * 
 * @author xujun/xKF58665 2012-11-19
 * 
 */
public class MD5Utils {
	private static char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7',
			'8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };

	/**
	 * MD5加密
	 * 
	 * @param s
	 * @return
	 * @author xujun/xKF58665 2012-11-19
	 */
	public static String MD5(String s) {
		return hex(s.getBytes());
	}

	/**
	 * MD5加密
	 * 
	 * @param b
	 * @return
	 * @author xujun/xKF58665 2012-11-19
	 */
	public static String MD5(byte[] b) {
		return hex(b);
	}

	/**
	 * 转化为16进制字符串
	 * 
	 * @param b
	 * @return
	 * @author xujun/xKF58665 2012-11-19
	 */
	private static String hex(byte[] b) {
		// 获得MD5摘要算法的 MessageDigest 对象
		MessageDigest mdInst;
		try {
			mdInst = MessageDigest.getInstance("MD5");
			// 使用指定的字节更新摘要
			mdInst.update(b);
			// 获得密文
			byte[] md = mdInst.digest();
			// 把密文转换成十六进制的字符串形式
			int j = md.length;
			char str[] = new char[j * 2];
			int k = 0;
			for (int i = 0; i < j; i++) {
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0 >>> 4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}
			return new String(str);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		}

	}

	public static void main(String[] args) {
		//贵哥
//		System.out
//				.println(MD5("HESHUOEVENT_HESHUO20150731111632136137139512015-08-03 09:19:31Oy#N8H2t"));
		//杜sir
//		System.out
//		.println(MD5("HESHUOEVENT_HESHUO20150731111632136137139512015-08-03 09:19:31Oy#N8H2t"));
		//太平
//		System.out
//		.println(MD5("HESHUOEVENT_HESHUO20150731111632188647818662015-08-03 09:19:31Oy#N8H2t"));
		//何婷
//		System.out
//		.println(MD5("HESHUOEVENT_HESHUO20150731111632159819215662015-08-03 09:19:31Oy#N8H2t"));
		//乔工提供 15890103135
//		System.out
//		.println(MD5("HESHUOEVENT_HESHUO20150731111632158901031352015-08-03 09:19:31Oy#N8H2t"));
//		System.out
//		.println(MD5("HESHUOEVENT_HESHUO20150731111632136137139512015-08-03 09:19:31Oy#N8H2t"));
	}
}
