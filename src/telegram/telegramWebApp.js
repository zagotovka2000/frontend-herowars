/* export const useTelegram = () => {
   const tg = window.Telegram?.WebApp;
   
   useEffect(() => {
     if (tg) {
       tg.ready();
       tg.expand();
     }
   }, [tg]);
 
   return {
     tg,
     user: tg?.initDataUnsafe?.user,
     initData: tg?.initData,
     initDataUnsafe: tg?.initDataUnsafe
   };
 };
 */
