# 관광택시 예약 플랫폼 투어랑(Tourang)<br />Frontend Repository
### 2025 관광 데이터 활용 공모전

<!-- 소개 -->
외국인 관광객이 직접 고르는 강릉 여행 코스를 토대로 관광택시 예약을 지원하는 서비스

> [투어랑 tourang](www.tourang.site)

## 📚 프로젝트 소개
<!-- 어떤 목표를 가지고 만들었는지... -->

## 🔨 사용 기술
<!-- 기술 + 버전 + 사용 이유 -->
### 기술
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">
<img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=Zustand&logoColor=white">
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
<img src="https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white">

### 디자인
<img src="https://img.shields.io/badge/CSSModules-000000?style=for-the-badge&logo=CSSModules&logoColor=white"> <img src="https://img.shields.io/badge/MotionOne-FFEB0E?style=for-the-badge&logo=MotionOne&logoColor=black">

### 협업
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"> <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white">
<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white">
<img src="https://img.shields.io/badge/Confluence-172B4D?style=for-the-badge&logo=Confluence&logoColor=white">
<img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white">

### 배포
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white">

### 테스트
<img src="https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=Storybook&logoColor=white">

## 기술 선정 이유
| Skills | 이유 |
| :--- | :--- |
| <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> | 팀 내 진행 속도와 커뮤니티 사이즈를 고려, CSR 위주 개발이라는 점에서 선정 |
| <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"> | 서비스의 사이즈를 고려하여 코드의 안정성과 유지보수성 확보 |
| <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white"> | 개발 서버의 빌드 및 실행 속도 단축 |
| <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=Zustand&logoColor=white"> | 컴포넌트나 페이지 간의 상태 전달 효율화, Props drilling을 방지 |
| <img src="https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white"> | 훅으로 간편하게 언어 설정이 가능하고, 사전에 번역하여 고정된 텍스트로 정확도를 향상  |
| <img src="https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=Storybook&logoColor=white"> | UI의 문서화를 통한 테스트 및 공유, 배포를 통해 디자이너와 협업이 가능해 선정 |

## ❇️ 주요 기능
- 메인 페이지: 서비스 내 추천 인기순 장소, 이벤트를 제공
- 나의 여정 생성 페이지: 원하는 장소를 선택하여 여행 일정 생성 가능
- 나의 여정 지도 페이지: 여행 일정에서 여행 루트와 여행지, 정렬하여 여행 순서, 그외 상세 사항을 적어 여행 계획 가능 
- 리스트 페이지 : 검색으로 장소 리스트 조회, 타입, 해시태그로 필터링 가능, 인기순/이름순 정렬 가능, 무한 스크롤 기능 
- 콘텐츠 페이지: 장소에 대한 상세 내용 조회(미니맵을 통한 장소 주소, 해시태그, 장소 소개 등), 해당 장소와 가까운 장소 추천
- 로그인 페이지: Email/OAuth 로그인 가능
- 회원가입 페이지: Email/OAuth 회원가입 가능
- 결제 페이지: 결제 방식을 선택하여 결제 후 일정을 저장하고 여행 택시를 예약
- 나의 여정 페이지: 예약한 여행 루투와 숙소, 음식점 등 여행지 지도로 확인
- 마이페이지 : 내 정보 확인, 수정 가능
- 좋아요 페이지 : 좋아요한 장소 리스트 조회, 카테고리별 구분

## 1차 개발(~ 25.9.19)
### 개발 내용
- 메인 페이지, 리스트 페이지, 나의 여정 생성 페이지 구현 완료
- 콘텐츠 페이지, 결제 페이지, 나의 여정 지도 페이지 70% 구현 완료
### 2차 개발 목표
- 리스트 페이지 사용성 개선
- Tanstack Query 캐싱 추가
- 나의 여정 생성 로직 개선
- 좋아요 페이지, 나의 여정페이지, 마이페이지 추가 구현 예정
- 스켈레톤 UI 추가
