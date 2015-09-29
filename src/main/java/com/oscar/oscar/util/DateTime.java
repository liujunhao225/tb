package com.oscar.oscar.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by alen on 15/3/20.
 */
public class DateTime {

    public static String format(String format) {
        return format(format, new Date());
    }

    public static String format(String format, Date dateObj) {
        return format(format, dateObj, Locale.ENGLISH);
    }

    public static String format(String format, Date dateObj, Locale locale)
    {
        return new SimpleDateFormat(format).format(dateObj);
    }

}
