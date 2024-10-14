import React, { useRef, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import './CustomScrollbars.scss';

const CustomScrollbars = ({ className, disableVerticalScroll, children, quickScroll, ...otherProps }) => {
    const scrollbarRef = useRef(null);

    const getScrollTop = useCallback(() => {
        return scrollbarRef.current?.getScrollTop();
    }, []);

    const scrollTo = useCallback((targetTop) => {
        const scrollbars = scrollbarRef.current;
        if (!scrollbars) return;

        const originalTop = scrollbars.getScrollTop();
        let iteration = 0;

        const scroll = () => {
            iteration++;
            if (iteration > 30) return;

            scrollbars.scrollTop(originalTop + (targetTop - originalTop) / 30 * iteration);

            if (quickScroll) {
                scroll();
            } else {
                setTimeout(() => scroll(), 20);
            }
        };

        scroll();
    }, [quickScroll]);

    const scrollToBottom = useCallback(() => {
        const scrollbars = scrollbarRef.current;
        if (!scrollbars) return;

        const targetScrollTop = scrollbars.getScrollHeight();
        scrollTo(targetScrollTop);
    }, [scrollTo]);

    const renderTrackVertical = (props) => {
        return <div {...props} className="track-vertical" />;
    };

    const renderThumbVertical = (props) => {
        return <div {...props} className="thumb-vertical" />;
    };

    const renderNone = (props) => {
        return <div />;
    };

    return (
        <Scrollbars
            ref={scrollbarRef}
            autoHide={true}
            autoHideTimeout={200}
            hideTracksWhenNotNeeded={true}
            className={className ? `${className} custom-scrollbar` : 'custom-scrollbar'}
            {...otherProps}
            // Chỉ render thanh cuộn dọc
            renderTrackHorizontal={renderNone} // Vô hiệu hóa thanh cuộn ngang
            renderTrackVertical={disableVerticalScroll ? renderNone : renderTrackVertical}
            renderThumbHorizontal={renderNone} // Vô hiệu hóa thanh cuộn ngang
            renderThumbVertical={disableVerticalScroll ? renderNone : renderThumbVertical}
        >
            {children}
        </Scrollbars>
    );
};

export default CustomScrollbars;
