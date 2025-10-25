// Новые маршруты для WebGL боев
router.post('/battle/start', async (req, res) => {
   try {
     const { userId } = req.body;
     
     // Находим пользователя и его команду
     const user = await models.User.findByPk(userId);
     const userTeam = await models.Team.findOne({
       where: { userId, isActive: true },
       include: [{ 
         model: models.Hero,
         include: [models.HeroSkill]
       }]
     });
 
     if (!userTeam || userTeam.Heroes.length !== 5) {
       return res.status(400).json({ error: 'Need full team of 5 heroes' });
     }
 
     // Находим противника (пока случайного пользователя)
     const opponent = await models.User.findOne({
       where: { id: { [models.Sequelize.Op.ne]: userId } },
       include: [{
         model: models.Team,
         where: { isActive: true },
         include: [{
           model: models.Hero,
           include: [models.HeroSkill]
         }]
       }]
     });
 
     if (!opponent) {
       return res.status(404).json({ error: 'No opponent found' });
     }
 
     // Создаем запись о битве
     const battle = await models.Battle.create({
       player1Id: userId,
       player2Id: opponent.id,
       status: 'in_progress'
     });
 
     // Генерируем начальное состояние для WebGL
     const battleState = await services.battleService.generateWebGLBattleData(
       userTeam, 
       opponent.Teams[0]
     );
 
     await battle.update({ battleState });
 
     res.json({
       battleId: battle.id,
       ...battleState
     });
 
   } catch (error) {
     console.error('Battle start error:', error);
     res.status(500).json({ error: error.message });
   }
 });
 
 router.post('/battle/turn', async (req, res) => {
   try {
     const { battleId, action } = req.body;
     
     const result = await services.battleService.simulateBattleTurn(battleId, action);
     
     res.json(result);
   } catch (error) {
     console.error('Battle turn error:', error);
     res.status(500).json({ error: error.message });
   }
 });
 
 router.get('/battle/:battleId/state', async (req, res) => {
   try {
     const { battleId } = req.params;
     
     const battle = await models.Battle.findByPk(battleId);
     if (!battle) {
       return res.status(404).json({ error: 'Battle not found' });
     }
     
     res.json(battle.battleState);
   } catch (error) {
     console.error('Get battle state error:', error);
     res.status(500).json({ error: error.message });
   }
 });
