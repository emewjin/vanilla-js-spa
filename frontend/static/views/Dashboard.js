import AbstractView from "./AbstractView";

export default class extends AbstractView {
  constructor() {
    this.setTitle("Dashboard");
  }

  /**
   *
   * @returns app div에 그려낼 해당 view의 html을 반환합니다.
   */
  async getHtml() {
    return `
            <h1>초기 페이지입니다</h1>
        `;
  }
}
