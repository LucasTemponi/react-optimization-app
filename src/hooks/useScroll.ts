import { MutableRefObject, useEffect, useState } from "react";

export const useScroll = (scrollRef: MutableRefObject<Element | null>) => {
  const [endOfScroll, setEndOfScroll] = useState(false);
  const [ scrollPosition , setScrollPosition] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    const scroll = scrollRef.current;
    scroll?.addEventListener('scroll', updateEndOfScroll);

    return () => {
      scroll?.removeEventListener('scroll', updateEndOfScroll);
    }
  }, [scrollRef.current]);

  const updateEndOfScroll = () => {
    const clientHeight = scrollRef.current?.clientHeight
    if (clientHeight){
      setEndOfScroll(Math.abs(getDistanceFromBottom()) <  clientHeight/3);    
  
    };
  }
  const getDistanceFromBottom = (): number => {
    if (scrollRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
      setScrollHeight(scrollHeight-clientHeight);
      setScrollPosition(scrollTop);      
      return Math.ceil(scrollTop)
    }
    return Infinity;
  };

  const scrollBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return {
    scrollBottom,
    endOfScroll,
    updateEndOfScroll,
    getDistanceFromBottom,
    scrollPosition,
    scrollHeight
  }
};