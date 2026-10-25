import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// dayjs is bundled with this package; host-registered locales don't reach this instance,
// so import the zh-cn locale object explicitly and pass it via .locale().
import zhCn from 'dayjs/locale/zh-cn';
import { Cursor } from '../Cursor';
import { cn } from '../../utils/cn';

export type TimeType = 'hud' | 'game';
export type TimeLocale = 'en' | 'zh-cn';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 显示风格：hud（左右结构：星期/日期 + 时间）| game（上下结构：时间 / 分割线 / 日期 + 周几），默认 game */
    type?: TimeType;
    /** 星期格式，支持 dayjs 核心 token（dddd / ddd / dd 等）。
     *  hud 默认 dddd，game 默认 dd（zh-cn 下为单字如"日") */
    weekdayFormat?: string;
    /** 月日格式，支持 dayjs 核心 token（MMM D / M月D日 等）。
     *  hud 默认 MMM D，game 默认 M月D日（locale=zh-cn 下） */
    dateFormat?: string;
    /** 语言，决定 dddd / MMM 等的输出，默认 hud='en' / game='zh-cn' */
    locale?: TimeLocale;
}

const pad = (n: number) => String(n).padStart(2, '0');

export const Time = React.forwardRef<HTMLDivElement, TimeProps>(
    ({ className, type = 'game', weekdayFormat, dateFormat, locale, ...rest }, ref) => {
        const [now, setNow] = useState(() => new Date());

        useEffect(() => {
            const timer = setInterval(() => setNow(new Date()), 1_000);
            return () => clearInterval(timer);
        }, []);

        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());

        const resolvedLocale: TimeLocale = locale ?? (type === 'game' ? 'zh-cn' : 'en');
        const local = dayjs(now).locale(resolvedLocale === 'zh-cn' ? zhCn : 'en');

        if (type === 'game') {
            const wFmt = weekdayFormat ?? 'dd';
            const dFmt = dateFormat ?? (resolvedLocale === 'zh-cn' ? 'M月D日' : 'MMM D');
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
                        <span className="animal-time-game-monthday">{local.format(dFmt)}</span>
                        <span className="animal-time-game-weekday">{local.format(wFmt)}</span>
                    </div>
                </div>
            );
        }

        const wFmt = weekdayFormat ?? 'dddd';
        const dFmt = dateFormat ?? (resolvedLocale === 'zh-cn' ? 'M月D日' : 'MMM D');
        return (
            <Cursor>
                <div
                    ref={ref}
                    className={cn('animal-time', className)}
                    {...rest}
                >
                    <div className="animal-time-date">
                        <span className="animal-time-weekday">{local.format(wFmt)}</span>
                        <span className="animal-time-monthday">{local.format(dFmt)}</span>
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
