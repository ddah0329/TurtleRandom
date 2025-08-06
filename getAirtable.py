import httpx
import json
from dotenv import load_dotenv
import os

# .env 파일에서 환경 변수 로드
load_dotenv()

# .env에서 API 키 및 베이스 정보 가져오기
API_KEY = os.getenv('AIRTABLE_API_KEY')
BASE_ID = os.getenv('AIRTABLE_BASE_ID')
TABLE_NAME = os.getenv('AIRTABLE_TABLE_NAME')

# 에어테이블 API 엔드포인트 URL
URL = f'https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}'

# 헤더 설정 (Authorization과 Content-Type)
HEADERS = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# 데이터 요청 함수


def fetch_all_airtable_data():
    all_data = []
    params = {
        'maxRecords': 500,  # 한 번에 최대 100개의 레코드
        'view': 'Grid view'  # 기본 뷰 사용, 필요시 변경
    }

    with httpx.Client() as client:
        while True:
            response = client.get(URL, headers=HEADERS, params=params)
            if response.status_code == 200:
                records = response.json()['records']
                all_data.extend(records)  # 받아온 데이터 리스트에 추가
                # 페이지네이션을 위해 다음 페이지가 있으면 계속해서 요청
                offset = response.json().get('offset')
                if offset:
                    params['offset'] = offset  # 다음 페이지의 offset 추가
                else:
                    break  # 더 이상 데이터가 없으면 종료
            else:
                print(f"Error: {response.status_code}")
                break

        return all_data

# 데이터를 JSON 파일로 저장하는 함수
def save_to_json(data, filename='airtable_data.json'):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


# 메인 실행 부분
if __name__ == "__main__":
    data = fetch_all_airtable_data()
    save_to_json(data)
    print("All data has been saved to 'airtable_data.json'.")
