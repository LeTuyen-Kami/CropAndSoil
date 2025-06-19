### Code nodejs để tạo file csv

- Data ban đầu sẽ là một danh sách cái botle code là
  N5MXUX818S0918MPOG2GA0TRKEXFZ91Y
  TJR7HLD7HR0918MPOG2GA0TOV5NSQ76I
  5OJJDX8WGH0918MPOG2GA0C73WVXTOK5
  2EJGZI1SZV0918MPOG2GA0XD46MW6298
  QJJIXQ21680918MPOG2GA0DCXIXBUKLA
  6WV0246LF00918MPOG2GA05MN7WC8EEZ
  37JFY7AFZN0918MPOG2GA0MWDX0TWSEZ
  G3BWAUEMC30918MPOG2GA0UR90FZSIJY
  FUVM8GXOXA0918MPOG2GA03PECLLTAJD
  3JAR5OJ3L00918MPOG2GA0LS7J3Y8W7P

- bạn tạo code fetch data từ api https://trace-open-api-uat.motul.com.sg/customer/mote/open/api/v1/codeQuery
- bearer token là eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJ7XCJlbnRlcnByaXNlVXNlckFjY291bnRcIjpcInVhdF9zeW5jX3Btc1wiLFwiYWNjZXNzS2V5XCI6XCI0NWEyMzU0MzBiOTE0YmU0YTM1NTFlYTYxNGYyYzFhZVwiLFwiZW50ZXJwcmlzZU5vXCI6XCIxMzI1NjY2NzYyMTFcIixcImVudGVycHJpc2VVc2VySWRcIjpcIjE5Mjk0MTc5MzIxNDkyNDM5MDRcIixcImFwcElkXCI6XCIxOTI5NDE4OTIzNjQzMzMwNTYwXCJ9Iiwic3ViIjoiMTkyOTQxODkyMzY0MzMzMDU2MCIsImlzcyI6Inllc25vLmNvbS5jbiIsImV4cCI6MTc1MDI0NzMyNzA4NywiaWF0IjoxNzUwMjE4NTI3MDg3LCJ2ZXJzaW9uIjoiMS4wIiwianRpIjoiOTQyNTdmYzFjMjliNGIzNjk1MmE3ZmI2ZTk1NDBjOTAifQ.uJd8jeuxHjPEP8-DWZ3ZU5IvDWw7dJqK8N4LeqyXy10
- body sẽ là:
  {
  "searchCode": "N5MXUX818S0918MPOG2GA0TRKEXFZ91Y",
  "queryType": 1
  }

- Sau khi fetch data xong sẽ tạo bảng csv với các cột là:

  - botle code
  - request: sẽ là body request hiện tại
  - response: sẽ là response từ api

- Sau đó lưu file csv với tên là data.csv trong cùng folder với file này
