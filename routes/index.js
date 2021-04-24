const express = require('express');
const router = express.Router();

const libKakaoWork = require('../libs/kakaoWork');

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
			libKakaoWork.sendMessage({
				conversationId: conversation.id,
				text: '땅파고 챗봇',
				blocks: [
					{
						type: 'button',
						text: '마법의 소라고동',
						style: 'default',
					},
					{
						type: 'button',
						text: '한국인만 알아볼수 있는 번역기',
						style: 'default',
					},
					{
						type: 'action',
						elements: [
							{
								type: 'button',
								action_type: 'call_modal',
								value: 'fibona_chiken',
								text: '피보나치킨',
								style: 'default',
							},
							{
								type: 'button',
								text: '퇴근시간 타이머',
								style: 'default',
							},
						],
					},
					{
						type: 'action',
						elements: [
							{
								type: 'button',
								text: '기원',
								style: 'default',
							},
							{
								type: 'button',
								text: '운세 뽑기',
								style: 'default',
							},
						],
					},
				],
			})
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
			return res.json({
				view: {
					title: '피보나치킨',
					accept: '전송',
					decline: '취소',
					value: 'fibona_chiken_results',
					blocks: [
						{
							type: 'label',
							text: '치킨을 먹을 인원수를 알려주세요',
							markdown: false,
						},
						{
							type: 'input',
							name: 'people',
							required: true,
							placeholder: '인원수를 입력해주세요',
						},
					],
				},
			});
			break;
		default:
	}

	res.json({});
});

router.post('/callback', async (req, res, next) => {
	console.log(req.body);
	const { message, actions, action_time, value } = req.body;

	switch (value) {
		case 'fibona_chiken_results':
			// 피보나치킨 응답 결과 메세지 전송  -- 아직 인원수에 따라 재미있는 문구는 생각못함.
			await libKakaoWork.sendMessage({
				conversationId: message.conversation_id,
				text: '최적의 치킨 수를 찾았습니다!',
				blocks: [
					{
						type: 'header',
						text: '🐓 최적의 치킨 수 🍗',
						style: 'blue',
					},

					{
						type: 'text',
						text: actions.people+' 명이 배부르게 먹으려면',
						markdown: true,
					},
					{
						type: 'text',
						text: fibo(actions.people)+' 마리를 시키세요!',
						markdown: true,
					},
					{
						type: 'image_link',
						url:
							'https://image.chosun.com/sitedata/image/201705/31/2017053100563_0.jpg',
					},
					{
						type: 'context',
						content: {
							type: 'text',
							text:
								'[남기지 않는다.치킨.피보나치킨!](https://fibonachicken.herokuapp.com/)',
							markdown: true,
						},
						image: {
							type: 'image_link',
							url:
								'https://cdn.icon-icons.com/icons2/2348/PNG/512/link_icon_142996.png',
						},
					},
				],
			});
			break;
		default:
	}

	res.json({ result: true });
});

module.exports = router;


//피보나 치킨 수 구하기
function fibo(number){
	var d = [0,1,1], i, res=0;
	
	for(i=2;d[i-1]<number;i++){
		d[i]=d[i-1]+d[i-2];
	}

	for(;i && number;i--){
		if(number>=d[i]){
			number-=d[i];
			res+=d[i-1];
		   }
	}
	return res
}


