# hziee-api

[![Build Status](https://api.travis-ci.org/BetaSummer/hziee-api.svg?branch=master)](https://travis-ci.org/BetaSummer/hziee-api)

The API to get the data of hziee EAS (educational management system).

------

## Usage

```bash
git clone https://github.com/BetaSummer/hziee-api
npm install
npm run watch
```

## Deploy

```bash
npm install pm2 -g
npm run prod
```

------

## Docs

### 1. cookie

- POST /cookies

- Request：

  | Parameter Name | Description | body                              | Data Type |
  | -------------- | ----------- | --------------------------------- | --------- |
  | stuId          | 学号          | application/x-www-form-urlencoded | string    |
  | password       | 密码          | application/x-www-form-urlencoded | string    |

- Response:

  - 201:成功获取 cookie

    ```json
    {
      "cookie": "ASP.NET_SessionId=33pffyiteuizeyszup12y2z3; path=/; HttpOnly"
    }
    ```

### 2.lesson 课程

- GET /lessons

- Request:

  | Parameter Name | Description | Type                                    | Data Type |
  | -------------- | ----------- | --------------------------------------- | --------- |
  | cookie         | cookie      | Headers(Authorization)                  | string    |
  | stuId          | 学号          | body(application/x-www-form-urlencoded) | string    |

- Response

  - 200: 成功获取课程信息

    ```json
    [
        [
            {
                "name": "工程数学",
                "time": "星期一",
                "timeDetail": "周一第3,4节{第1-16周}",
                "period": "10:05~11:40",
                "teacher": "爱因斯坦",
                "classroom": "6jxC309"
            }
        ],
        [
            {
                "name": "英语3-读写",
                "time": "星期二",
                "timeDetail": "周二第1,2节{第1-16周}",
                "period": "8:20~9:55",
                "teacher": "特朗普",
                "classroom": "6jxC410"
            },
            {
                "name": "排球1",
                "time": "星期二",
                "timeDetail": "周二第8,9节{第1-16周}",
                "period": "15:10~16:45",
                "teacher": "郎平",
                "classroom": "待定"
            }
        ],
    ]
    ```

### 3.exam 考试安排

- GET /exams

- Request:

  | Parameter Name | Description | Type                                    | Data Type |
  | -------------- | ----------- | --------------------------------------- | --------- |
  | cookie         | cookie      | Headers(Authorization)                  | string    |
  | stuId          | 学号          | body(application/x-www-form-urlencoded) | string    |

- Response:

  - 200: 成功获取考试安排

    ```json
    [
        {
            "name": "数据结构",
            "time": "2017年1月12日(09:00-11:00)",
            "location": "6jxB313",
            "seat": "15"
        },
        {
            "name": "英语3-阅读",
            "time": "2017年1月6日(13:45-15:45)",
            "location": "6jxB206",
            "seat": "38"
        },
        {
            "name": "工程数学",
            "time": "2017年1月4日(09:00-11:00)",
            "location": "6jxC301",
            "seat": "36"
        }
    ]
    ```

### 4.grade 成绩

- GET /grades

- Request:

  | Parameter Name | Description | Type                                    | Data Type |
  | -------------- | ----------- | --------------------------------------- | --------- |
  | cookie         | cookie      | Headers(Authorization)                  | string    |
  | stuId          | 学号          | body(application/x-www-form-urlencoded) | string    |

- Response:(Todo)