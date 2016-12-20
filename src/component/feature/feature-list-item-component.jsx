import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Chip, Switch, Icon, IconButton } from 'react-mdl';
import Progress from './progress';
import { shorten, calc } from '../common';

import style from './feature.scss';

const Feature = ({
    feature,
    onFeatureClick,
    onFeatureRemove,
    settings,
    metricsLastHour = { yes: 0, no: 0, isFallback: true },
    metricsLastMinute = { yes: 0, no: 0, isFallback: true },
}) => {
    const { name, description, enabled, strategies } = feature;

    const { showLastHour = false } = settings;
    const isStale = showLastHour ? metricsLastHour.isFallback : metricsLastMinute.isFallback;

    const percent = 1 * (showLastHour ?
        calc(metricsLastHour.yes, metricsLastHour.yes + metricsLastHour.no, 0) :
        calc(metricsLastMinute.yes, metricsLastMinute.yes + metricsLastMinute.no, 0)
    );
    return (
        <li key={name} className="mdl-list__item">
            <span className="mdl-list__item-primary-content">
                <div style={{ width: '40px', textAlign: 'center' }}>
                    {
                        isStale ?
                            <Icon
                                style={{ width: '25px', marginTop: '4px', fontSize: '25px', color: '#ccc' }}
                                name="report problem" title="No metrics avaiable" /> :
                            <div>
                                <Progress strokeWidth={15} percentage={percent} width="50" />
                            </div>
                    }
                </div>

                &nbsp;
                <span style={{ display: 'inline-block', width: '45px' }} title={`Toggle ${name}`}>
                    <Switch title="test" key="left-actions" onChange={() => onFeatureClick(feature)} checked={enabled} />
                </span>
                <Link to={`/features/view/${name}`} className={style.link}>
                    {name} <small>{shorten(description, 30) || ''}</small>
                </Link>
            </span>

            <span className={style.iconList} >
                {strategies && strategies.map((s, i) => <Chip className={style.iconListItemChip} key={i}>
                    <small>{s.name}</small>
                </Chip>)}
                <Link to={`/features/edit/${name}`} title={`Edit ${name}`} className={style.iconListItem}>
                    <IconButton name="edit" />
                </Link>
                <Link to={`features/history/${name}`} title={`History htmlFor ${name}`} className={style.iconListItem}>
                    <IconButton name="history" />
                </Link>
                <IconButton name="delete" onClick={() => onFeatureRemove(name)} className={style.iconListItem} />
            </span>

        </li>
    );
};

Feature.propTypes = {
    feature: PropTypes.object,
    onFeatureClick: PropTypes.func,
    onFeatureRemove: PropTypes.func,
};

export default Feature;