import React from 'react';
import { Cursor } from '../Cursor';
import { cn } from '../../utils/cn';
import { useNow } from '../../utils/useNow';

export interface TimeProps extends React.HTMLAttributes<HTMLDivElement> {}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const Time = React.forwardRef<HTMLDivElement, TimeProps>(({ className, ...rest }, ref) => {
    const currentTime = useNow();

    return (
        <Cursor>
            <div
                ref={ref}
                className={cn('animal-time', className)}
                {...rest}
            >
                <div className="animal-time-date">
                    <span className="animal-time-weekday">
                        {weekdays[currentTime.getDay()]}
                    </span>
                    <span className="animal-time-monthday">
                        {months[currentTime.getMonth()]} {currentTime.getDate()}
                    </span>
                </div>
                <div className="animal-time-clock">
                    {currentTime.getHours().toString().padStart(2, '0')}
                    <span className="animal-time-colon">:</span>
                    {currentTime.getMinutes().toString().padStart(2, '0')}
                </div>
            </div>
        </Cursor>
    );
});

Time.displayName = 'Time';
