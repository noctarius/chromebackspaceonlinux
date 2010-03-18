package org.sourceprojects.backspace.utils;

import java.util.Calendar;

import org.sourceprojects.backspace.domain.CachedStatistic;
import org.sourceprojects.backspace.domain.StatisticType;
import org.sourceprojects.backspace.domain.UsageData;

public class StatisticsUtils {
	private StatisticsUtils() {
	}

	public static final CachedStatistic calculateDailyStatistics(
			CachedStatistic[] hours) {
		if (hours.length != 24)
			throw new RuntimeException("Wrong CachedStatistic.length");

		CachedStatistic result = new CachedStatistic();

		Calendar cal = Calendar.getInstance();
		cal.setTime(hours[0].getDate());
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);

		long users = 0, clicks = 0;
		for (CachedStatistic statistic : hours) {
			users += statistic.getUsers();
			clicks += statistic.getClicks();
		}

		result.setType(StatisticType.Daily);
		result.setDate(cal.getTime());
		result.setUsers(users / 24);
		result.setClicks(clicks);

		return result;
	}

	public static final CachedStatistic calculateHourlyStatistics(
			UsageData[] usageDatas) {
		CachedStatistic result = new CachedStatistic();

		Calendar cal = Calendar.getInstance();
		cal.setTime(usageDatas[0].getTimestamp());
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);

		long users = 0, clicks = 0;
		for (UsageData data : usageDatas) {
			users ++;
			clicks += data.getClicks();
		}

		result.setType(StatisticType.Hourly);
		result.setDate(cal.getTime());
		result.setUsers(users);
		result.setClicks(clicks);

		return result;
	}
}
