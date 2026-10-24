import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Cursor } from '../Cursor';
import { cn } from '../../utils/cn';

export type TimeType = 'hud' | 'game';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 显示风格：hud（左右结构：星期/日期 + 时间）| game（上下结构：时间 / 分割线 / 日期 + 周几），默认 game */
    type?: TimeType;
    /** dayjs 格式字符串，用于自定义星期显示，例如 'dddd'（完整名称）或 'ddd'（缩写） */
    weekdayFormat?: string;
    /** dayjs 格式字符串，用于自定义日期显示，例如 'MMMM D' 或 'MM月DD日' */
    dateFormat?: string;
    /** dayjs locale 标识符，例如 'zh-cn' 或 'en' */
    locale?: string;
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekdaysCN = ['日', '一', '二', '三', '四', '五', '六'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const Time = React.forwardRef<HTMLDivElement, TimeProps>(
    ({ className, type = 'game', weekdayFormat, dateFormat, locale, ...rest }, ref) => {
        const [currentTime, setCurrentTime] = useState(new Date());

        useEffect(() => {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);

        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const d = locale ? dayjs(currentTime).locale(locale) : dayjs(currentTime);

        if (type === 'game') {
            const monthday = dateFormat
                ? d.format(dateFormat)
                : `${currentTime.getMonth() + 1}月${currentTime.getDate()}日`;
            const weekday = weekdayFormat
                ? d.format(weekdayFormat)
                : weekdaysCN[currentTime.getDay()];

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
                        <span className="animal-time-game-monthday">{monthday}</span>
                        <span className="animal-time-game-weekday">{weekday}</span>
                    </div>
                </div>
            );
        }

        const monthday = dateFormat
            ? d.format(dateFormat)
            : `${months[currentTime.getMonth()]} ${currentTime.getDate()}`;
        const weekday = weekdayFormat
            ? d.format(weekdayFormat)
            : weekdays[currentTime.getDay()];

        return (
            <Cursor>
                <div
                    ref={ref}
                    className={cn('animal-time', className)}
                    {...rest}
                >
                    <div className="animal-time-date">
                        <span className="animal-time-weekday">{weekday}</span>
                        <span className="animal-time-monthday">{monthday}</span>
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
