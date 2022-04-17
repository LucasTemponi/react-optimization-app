import { MutableRefObject, useEffect,useRef, useState } from "react";
import { useChat } from "../../contexts/chat.context";
import { useScroll } from "../../hooks/useScroll";
import { ChatMessage } from "../ChatMessage";
import { ChatMessageListBottomScrollButton } from "../ChatMessageListBottomScrollButton";
import { MyChatMessage } from "../MyChatMessage";

export const ChatMessageList = () => {
  const scrollRef: MutableRefObject<Element | null> = useRef(null);
  const { mensagens, buscaMensagem, setMensagens } = useChat();
  const [pagina,setPagina] = useState(1);

  const {
    scrollBottom,
    endOfScroll,
    updateEndOfScroll,
    scrollPosition,
    scrollHeight,
  } = useScroll(scrollRef);


  useEffect(() => {
    scrollRef.current = document.querySelector('#mensagens');
    lerNovasMensagens();
  }, []);

  useEffect(() => {
    updateEndOfScroll();
  }, [scrollPosition]);

  useEffect(() => {
    if (endOfScroll) {
      lerNovasMensagens();
    }
  }, [mensagens.length]);

  useEffect(() => {
    const shouldLoadPage = Math.abs(scrollPosition) > 0.8*(scrollHeight)
     if ( shouldLoadPage && pagina*20<=mensagens.length){
      setPagina(pagina+1);   
     }
  }, [scrollPosition]);


  const lerNovasMensagens = () => {
    scrollBottom();
    mensagens.forEach(mensagem => {
      mensagem.lida = true;
    });
    setMensagens([...mensagens]);
  };

  return (
    <div id="mensagens" className="flex flex-col-reverse space-y-4 p-3 overflow-y-auto scrollbar-thumb-purple scrollbar-thumb-rounded scrollbar-track-indigo-lighter scrollbar-w-2 scrolling-touch">
      {
        [...mensagens]
        .filter(mensagem => mensagem.texto.match(new RegExp(buscaMensagem, 'i')))
        .slice(0, pagina * 20)
        .map(mensagem => (          
          mensagem.autor.usuarioAtual ?
            <MyChatMessage key={mensagem.id} mensagem={ mensagem }  /> :
            <ChatMessage key={mensagem.id} mensagem={ mensagem } />
        ))
      }
      {
        !endOfScroll ? (
          <ChatMessageListBottomScrollButton
            onClick={() => lerNovasMensagens()}
            naoLidos={mensagens.filter(m => !m.lida).length}
          />
        ) : <></>
      }
    </div>
  );
}
