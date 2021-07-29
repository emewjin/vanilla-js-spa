# 바닐라 자바스크립트로 SPA 구현해보기

- `node.js`, `vanilla javascript`, `history API`를 이용합니다
- SPA를 위한 라우팅을 구현합니다 (동적 라우팅 포함)
- 구현 과정 및 공부 내용은 [📎개인 블로그](https://emewjin.github.io/study/vanilaspa)에 정리되어 있습니다

## 실행

`npm start`

## jest를 이용한 테스트

- https://dev.to/thawkin3/how-to-unit-test-html-and-vanilla-javascript-without-a-ui-framework-4io

### jest 설치

- `npm install --save-dev jest` : jest 설치
- `npm install --save-dev @testing-library/dom`
- `npm install --save-dev @testing-library/jest-dom`

그냥 실행하면 에러가 난다.

### 바벨 설치

- Reference : https://poiemaweb.com/es6-babel-webpack-1
- `npm install --save-dev @babel/core @babel/cli`
- `npm install --save-dev @babel/preset-env`

그리고 바벨 설정 파일을 만들어준다

- `babel.config.js`

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "> 0.25%, not dead",
      },
    ],
  ],
};
```

jest설정 파일도 만들어준다

- `jest.config.js`

```js
module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: ["regenerator-runtime/runtime"],
  testPathIgnorePatterns: ["/node_modules/"],
};
```

---

<details>
<summary>블로그 정리 전 임시로 기록해두었던 내용들</summary>
<div markdown="1">

# 간단하게 정리하는 문서

- [유튜브 강의](https://www.youtube.com/watch?v=6BozpmSjk-Y&t=900s)를 보고 바닐라 자바스크립트로 SPA 구현해보기
- 블로그에 올리기 전에 임시로 기록하는 공간
- [참고한 git 저장소](https://github.com/Siihyun/CODEV21-FRONT)

  리액트로 SPA를 만들고 동적라우팅으로 구성을 하면서 SPA가 뭐고 라우팅이 뭔지는 얕게 알게 되었으나 그게 실제로 어떻게 동작하는지 내부적인 부분은 알지 못했다. 바닐라 자바스크립트로 직접 구현해보면서 어떤걸 써서 그렇게 만들 수 있었던 건지를 알아보고자 함.

## Router 만들기

- 현재 location의 pathname이 지정한 route의 path와 일치하는지를 확인한다. /에서는 path가 /인 것의 isMatch가 true로 반환되고 /courses에서는 path가 그와 동일한 두번째 객체의 isMatch가 true로 반환된다.

```js
(3) [{…}, {…}, {…}]
[
    {
        "route": {
            "path": "/"
        },
        "isMatch": true
    },
    {
        "route": {
            "path": "/courses"
        },
        "isMatch": false
    },
    {
        "route": {
            "path": "/courses/:id"
        },
        "isMatch": false
    }
]
```

- 그중에서 true인 것만을 찾기 위해 find 메소드를 이용한다.

```js
let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);
```

- isMatch는 추후 result로 대체될 것인데, 파라미터를 확인하여 동적라우팅을 해주는 역할을 하게 될 것이다.

### `pushstate()`

- history API > window의 이벤트. window를 생략하고 그냥 `pushState()` 로만 쓸 수도 있다.
- `pushState()`를 사용해서 브라우저의 주소를 바꾼다.
- 뒤로가기를 눌렀을 때 url만 바꿔줄 뿐 다시 렌더링을 해주지는 않는다. (router를 다시 동작시키지 않음) 이에 주의해야 한다.
- pushState는 state, title, url 세 개의 인자를 받는다.
- state : 새로운 세션 기록 항목에 연결할 상태 객체. 새로운 데이터 객체를 의미한다. 저장해야할 데이터가 없다면 null 또는 빈 객체를 전달한다.
- title : 보통 빈 문자열을 지정한다. 현재 대부분의 브라우저가 title을 무시하기 때문. 또는 state에 대한 짧은 제목을 제공하는 용으로 쓰기도 한다.
- url : (optional) 새로운 세션 기록 항목의 url. 즉 이동하고 싶은 url. 현재 url과 같은 출처를 가져야 하며 지정하지 않는 경우 문서의 현재 url을 사용한다. 주의할 점은 pushState() 호출 이후에 브라우저는 주어진 URL로 탐색하지 않는다는 것.

```js
const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};
```

- href로 링크를 걸면 새로고침이 발생하므로 먼저 이를 막아야 한다. 아래 코드 실행시 새로고침 없이 페이지 이동이 가능함을 확인할 수 있다.

```js
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    //이벤트 위임을 위해 작성하는 코드
    //data-link라는 data attribute를 가진 링크에만 작동하도록 조건문을 작성해 이벤트를 위임한다
    if (e.target.matches("[data-link]")) {
      // 링크가 기본으로 가지고 있는 동작을 멈춰서 새로고침을 방지한다
      e.preventDefault();
      // 그리고 페이지 콘텐츠 변경 및 path 이동을 위해 우리가 만든 함수를 대신 실행한다
      // 링크가 가진 href를 url로 삼아서 함수를 실행한다
      navigateTo(e.target.href);
    }
  });
  router();
});
```

### popstate

- popstate가 뭘까.. MDN에서는 다음과 같이 말하고 있다

  > Window 인터페이스의 popstate 이벤트는 사용자의 세션 기록 탐색으로 인해 현재 활성화된 기록 항목이 바뀔 때 발생합니다. 만약 활성화된 엔트리가 history.pushState() 메서드나 history.replaceState() 메서드에 의해 생성되면, popstate 이벤트의 state 속성은 히스토리 엔트리 state 객체의 복사본을 갖게 됩니다.
  >
  > history.pushState() 또는 history.replaceState()는 popstate 이벤트를 발생시키지 않는 것에 유의합니다.popstate 이벤트는 브라우저의 백 버튼이나 (history.back() 호출) 등을 통해서만 발생된다.

- `pushState()`에서의 문제를 해결하기 위해 사용한다. potstate 이벤트가 발생할 때마다 router 함수를 호출한다. 이 router 함수는 밑에서 작성할 view를 그려내는 것을 포함하고 있다. 즉, `pushState()`만으로는 url이 바뀔 뿐 안의 콘텐츠까지 재렌더링 되지는 않으니 재렌더링 되도록 하기 위해 사용한다.

```js
window.addEventListener("popstate", router);
```

## View 만들기

그동안 리액트나 뷰 공식문서에서 왜 view라고 하는지 궁금했었는데 직접 만들어보니까 확 와닿으면서 알게되었다.
SPA이기 때문에 각 route의 콘텐츠를 page라고 부르는것은 앞뒤가 안맞고, 결국 보여지는 부분을 갈아끼우면서 렌더링하는 것이니 `view`라는 이름이 더없이 적절했다.

### 기본 템플릿 만들기

AbstractView.js로 기본 템플릿이 될 class를 만든다. 모든 view들은 이 class를 상속받아 확장해서 작성될 것이다. Template같은데 왜 AbstractView라고 이름을 지은걸까 궁금했는데 일종의 컨벤션인 것 같다. 그냥 Abstract Class라는 개념이 있음. [abstract에 대한 생활코딩 글](https://www.opentutorials.org/course/1223/6062)

> abstract라는 것이 상속을 강제하는 일종의 규제라고 생각하자. 즉 abstract 클래스나 메소드를 사용하기 위해서는 반드시 상속해서 사용하도록 강제하는 것이 abstract다. ... 추상 메소드란 메소드의 시그니처만이 정의된 비어있는 메소드를 의미한다.

추상이라고 하니까 말만 들어도 어렵다 ㅎ

### 각각의 view만들기

AbstractView를 상속받아 그에서 확장하여 만든다. 주로 해당 view의 html을 반환하는 함수를 이용한다. 이 함수를 async로 관리해줘야 하는 이유는 server side에서 렌더링 하기 위함이다. => 잘 모르겠음... 좀더 알아보고 추가작성 필요

```js
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Dashboard");
  }

  /**
   *
   * @returns app div에 그려낼 해당 view의 html을 반환합니다.
   */
  async getHtml() {
    return `
            <h1>초기 페이지입니다</h1>
            <p>      
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim dolore quia
              voluptate odio corporis aliquid? At adipisci labore eligendi rerum qui
              numquam tempora molestiae porro! Maxime hic aperiam sit eligendi?
            </p>
            <nav class="nav">
              <a href="/" class="nav__link" data-link>초기페이지</a>
              <a href="/courses" class="nav__link" data-link>코스</a>
            </nav>
        `;
  }
}
```

### view를 라우터와 연결하기

```js
//view가 class이기 때문에 new 생성자를 사용해서 새 인스턴스를 만든다
const view = new match.route.view();

// async await으로 관리해주지 않으면 추후 자바스크립트를 실행할 때,  html이 로드된 후 자바스크립트가 실행된다는 순서가 보장되지 않아 자바스크립트가 요소를 찾지 못해 에러가 날까?
document.querySelector("#app").innerHTML = await view.getHtml();
```

여기까지 하고 실행했을 때 마주하는 에러

> Dashboard:1 Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html". Strict MIME type checking is enforced for module scripts per HTML spec.

내 prettier, eslint 설정에서는 import를 할 때 .js 를 따로 붙이지 않는데, 그렇다보니 발생하는 문제였다. import할 때 경로에 .js 라는 확장자명을 추가해주었다. 만약 `import AbstractView from "./AbstractView";` 로 했을 때 AbstractView가 폴더였고 그 안에 `index.js`가 있었으면 상관없었을 텐데, 지금은 폴더가 아니라 단일 파일(?)이어서 파일 확장자명을 명시해준다.

## 동적라우팅

여기가 제일 복잡하다...

리액트에서 했던 것처럼 바닐라 자바스크립트도 :id로 파라미터를 작성한다. `/some/:id` 형식으로 들어왔는지 확인하기 위해 정규표현식을 작성한다.

```js
const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

console.log(pathToRegex("/posts/:id")); // /^\/posts\/(.+)$/

console.log("/posts/2".match(/^\/posts\/(.+)$/));
// [
//     "/posts/2",
//     "2"
// ]
```

url에서 파라미터를 가져오는 함수를 작성한다. 다음의 함수는

```js
["/posts/2", "2"];
```

요 배열에서 두번째 값만을 가져오는 역할을 한다.

```js
const getParams = (match) => {
  const values = match.result.slice(1);
};
```

```js
const getParams = (match) => {
  const values = match.result.slice(1);
  // 뒤에 쿼리파라미터 등이 붙어도 인지할 수 있게 작성
  // 중간중간 console.log를 찍어가면서 이해해야 한다.
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  console.log(Array.from(match.route.path.matchAll(/:(\w+)/g)));
  return {};
};

//요 함수가 console에 찍어내는 배열은 다음과 같다.

[[":id", "id"]];

0: Array(2)
0: ":id"
1: "id"
groups: undefined
index: 9
input: "/courses/:id"

  return Object.fromEntries(
    keys.map((key, i) => {
      console.log([key, values[i]]); // ["id","2"]
      return [key, values[i]];
    })
  );

```

</div>
</details>
