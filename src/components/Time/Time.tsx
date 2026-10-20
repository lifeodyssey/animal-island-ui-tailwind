import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Cursor } from '../Cursor';
import { cn } from '../../utils/cn';

export type TimeType = 'hud' | 'game';
export type TimeLocale = 'en' | 'zh-cn';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 显示风格：hud（左右结构：星期/日期 + 时间）| game（上下结构：时间 / 分割线 / 日期 + 周几），默认 game */
    type?: TimeType;
    /** 星期格式（dayjs format token），hud 模式有效，默认 'dddd' */
    weekdayFormat?: string;
    /** 日期格式（dayjs format token），hud 模式有效，默认 'MMM D' */
    dateFormat?: string;
    /** 语言，hud 模式有效，默认 'en' */
    locale?: TimeLocale;
}

const weekdaysCN = ['日', '一', '二', '三', '四', '五', '六'];

export const Time = React.forwardRef<HTMLDivElement, TimeProps>(
    ({ className, type = 'game', weekdayFormat, dateFormat, locale = 'en', ...rest }, ref) => {
        const [currentTime, setCurrentTime] = useState(new Date());

        useEffect(() => {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);

        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');

        if (type === 'game') {
            return (
                <div
                    ref={ref}
                    className={cn('animal-time-game', className)}
                    {...rest}
                >
                    <div className="animal-time-game-time">
                        {hours}
                        <span className="animal-time-game-colon">:</span>
                        {minutes}
                    </div>
                    <div className="animal-time-game-divider" />
                    <div className="animal-time-game-date">
                        <span className="animal-time-game-monthday">
                            {currentTime.getMonth() + 1}月{currentTime.getDate()}日
                        </span>
                        <span className="animal-time-game-weekday">{weekdaysCN[currentTime.getDay()]}</span>
                    </div>
                </div>
            );
        }

        const d = dayjs(currentTime).locale(locale);
        const weekdayStr = weekdayFormat ? d.format(weekdayFormat) : d.format('dddd');
        const monthdayStr = dateFormat ? d.format(dateFormat) : d.format('MMM D');

        return (
            <Cursor>
                <div
                    ref={ref}
                    className={cn('animal-time', className)}
                    {...rest}
                >
                    <div className="animal-time-date">
                        <span className="animal-time-weekday">
                            {weekdayStr}
                        </span>
                        <span className="animal-time-monthday">
                            {monthdayStr}
                        </span>
                    </div>
                    <div className="animal-time-clock">
                        {hours}
                        <span className="animal-time-colon">:</span>
                        {minutes}
                    </div>
                </div>
            </Cursor>
        );
    }
);

Time.displayName = 'Time';
