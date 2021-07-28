import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle = "courses";
  }

  async getHtml() {
    return `
        <h1 class="course">코스 페이지입니다</h1>
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
