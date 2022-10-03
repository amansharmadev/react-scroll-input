import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { debounce } from '../../utils';

const OuterContainer = styled.div`
  overflow-y: scroll;
  width: 250px;
  margin: auto;
  position: relative;
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
`;

const Section = styled.div`
  scroll-snap-align: center;
`;

/**
 * Initializers of the Scale Picker
 */
let notUserScroll = false;
/**
 * Using debouncer, because we have to trigger the onChange prop on end of the scroll
 * because javascript does not have any scroll end event
 */
// Using debouncer because we have to call onChange prop
const debounceFunction = debounce((value, onChange) => onChange(value), 100);

export default function ScalePicker({
  value,
  onChange,
  start: _start = 1,
  end: _end = 100,
  className,
}) {
  const scrollRef = useRef();

  const start = Math.floor(_start);
  const end = Math.floor(_end);

  /**
   * To set the start & end poiners of Scale Picker
   * here adding 10 from both end because can't select those 10 values
   */
  const [valueList] = useState(() =>
    Array.from({ length: end - start + 20 }, (v, k) => k + start - 10)
  );

  /**
   * When we receive value we have to scroll to that pointer
   * so, here scrolling to that point
   * also, do not trigger the onScroll event when we scroll programmatically
   */
  useEffect(() => {
    notUserScroll = true;
    const scrollValue = (value - start) * 12 + 1;
    scrollRef.current.scrollTo(scrollValue, 0);
  }, [value]);

  return (
    <OuterContainer
      ref={scrollRef}
      onScroll={(e) => {
        if (notUserScroll) {
          return (notUserScroll = false);
        }
        const currentValue = Math.floor(e.target.scrollLeft / 12) + start;
        debounceFunction(currentValue, onChange);
      }}
      className={className}
    >
      {valueList.map((val, i) => {
        return (
          <Section className="flex flex-col" key={i}>
            <div
              className={`border border-borderColor ${
                i % 10 ? 'h-6 mt-15' : 'h-12'
              } m-5 `}
            ></div>
            <span className={`w-0 text-chip mt-5 ${i === 0 && 'mr-3'}`}>
              {val % 10 === 0 && val}
            </span>
          </Section>
        );
      })}
      <div
        style={{ left: '114px', marginTop: '-22px' }}
        className="h-30 sticky border"
      >
        <div
          style={{
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '10px solid #714FFF',
          }}
        ></div>
        <div className="border border-primary-button h-16 w-0 mt-2 ml-1"></div>
      </div>
    </OuterContainer>
  );
}
