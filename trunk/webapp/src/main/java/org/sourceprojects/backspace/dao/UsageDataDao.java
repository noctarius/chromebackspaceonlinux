package org.sourceprojects.backspace.dao;

import java.util.Date;

import org.sourceprojects.backspace.domain.UsageData;

public interface UsageDataDao {
	
	public UsageData[] findbyDate(Date date);
	
	public void save(UsageData usageData);
}
