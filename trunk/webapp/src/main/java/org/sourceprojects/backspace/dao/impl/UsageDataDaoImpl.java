package org.sourceprojects.backspace.dao.impl;

import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.sourceprojects.backspace.dao.UsageDataDao;
import org.sourceprojects.backspace.domain.UsageData;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UsageDataDaoImpl extends HibernateTemplate implements UsageDataDao {

	@SuppressWarnings("unchecked")
	public UsageData[] findbyDate(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);

		Criteria criteria = getSession().createCriteria(UsageData.class);
		criteria.add(Restrictions.ge("timestamp", cal.getTime()));

		cal.add(Calendar.DAY_OF_MONTH, 1);
		criteria.add(Restrictions.lt("timestamp", cal.getTime()));

		List<UsageData> data = criteria.list();
		Collections.sort(data, new Comparator<UsageData>() {
			public int compare(UsageData o1, UsageData o2) {
				if (o1.getTimestamp().equals(o2.getTimestamp()))
					return 0;

				return o1.getTimestamp().after(o2.getTimestamp()) ? 1 : -1;
			}
		});

		return data.toArray(new UsageData[data.size()]);
	}

	public void save(UsageData usageData) {
		getSession().save(usageData);
		getSession().flush();
	}

}
