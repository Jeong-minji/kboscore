const axios = require("axios");
const cheerio = require("cheerio");

const getHTML = async () => {
  try {
    return await axios.get("http://www.statiz.co.kr/schedule.php");
  } catch (error) {
    console.log(error);
  }
};

getHTML().then((html) => {
  let dataList = [];

  const $ = cheerio.load(html.data);
  const gameCalendar = $(
    "html > body.skin-blue.layout-top-nav > div.wrapper > div.content-wrapper > div.container > section.content > div.row > div.col-md-12.col-xs-12.col-sm-12.col-lg-12 > div.row > div.col-xs-12.col-sm-12 > div.box > div.box-body.no-padding > table.table.table-striped.table-bordered > tbody > tr"
  );

  gameCalendar.map((_, trElement) => {
    const tdList = $(trElement).find("td");

    tdList.each((_, tdElement) => {
      const date = $(tdElement)
        .find("td > div > div.pull-left > a > span")
        .text();

      // 달력 날짜가 유효할 때
      if (!!date) {
        const scorePerDay = {
          date,
          games: $(tdElement)
            .find("td > div.hidden-xs > a")
            .map((_, item) => {
              const spanElements = $(item).children("span");

              return {
                away: $(spanElements).first().text(),
                home: $(spanElements).last().text(),
                awayScore: Number($(spanElements).eq(1).text()),
                homeScore: Number($(spanElements).eq(2).text()),
              };
            })
            .get(),
        };
        dataList = dataList.concat(scorePerDay);
      }
    });
  });

  return dataList;
});
