const express = require('express');
const router = express.Router();

const libKakaoWork = require('../libs/kakaoWork');

const fibo = require('../fibo');

router.get('/', async (req, res, next) => {
	// 유저 목록 검색 (1)
	const users = await libKakaoWork.getUserList();

	// 검색된 모든 유저에게 각각 채팅방 생성 (2)
	const conversations = await Promise.all(
		users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
	);

	// 생성된 채팅방에 메세지 전송 (3)
	const messages = await Promise.all([
		conversations.map((conversation) =>
			libKakaoWork.sendMessage(fibo.main_message(conversation.id))
		),
	]);

	// 응답값은 자유롭게 작성하셔도 됩니다.
	res.json({
		users,
		conversations,
		messages,
	});
});

router.post('/request', async (req, res, next) => {
	console.log(req.body);
	const { message, value } = req.body;

	switch (value) {
		case 'fibona_chiken':
			// 피보나치킨용 모달 전송 (3)
			return res.json(fibo.fibo_modal);
			break;
		default:
	}

	res.json({});
});

router.post('/callback', async (req, res, next) => {
	console.log(req.body);
	const { message, actions, action_time, value } = req.body;

	switch (value) {
		case 'back':
			await libKakaoWork.sendMessage(fibo.main_message(message.conversation_id));
			break;
		case 'fibona_chiken_results':
			// 피보나치킨 응답 결과 메세지 전송  -- 아직 인원수에 따라 재미있는 문구는 생각못함.
			await libKakaoWork.sendMessage(fibo.fibo_message(actions.people,message.conversation_id));
			break;
		default:
	}

	res.json({ result: true });
});

module.exports = router;

