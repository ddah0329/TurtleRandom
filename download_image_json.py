import json
import os
import requests

# JSON 파일 경로
JSON_FILE_PATH = 'src/airtable_data.json'

# 이미지 저장 디렉토리
IMAGE_SAVE_DIR = 'downloaded_images'

# 디렉토리 생성
if not os.path.exists(IMAGE_SAVE_DIR):
    os.makedirs(IMAGE_SAVE_DIR)

# JSON 데이터 로드 함수


def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 이미지 다운로드 함수


def download_images(data):
    for record in data:
        # image 필드에서 URL 가져오기
        images = record.get('fields', {}).get('image', [])
        for image in images:
            url = image.get('url')
            filename = image.get('filename')  # 파일명 추출
            if url and filename:
                try:
                    response = requests.get(url, stream=True)
                    if response.status_code == 200:
                        save_path = os.path.join(IMAGE_SAVE_DIR, filename)
                        with open(save_path, 'wb') as f:
                            for chunk in response.iter_content(1024):
                                f.write(chunk)
                        print(f"Downloaded: {save_path}")
                    else:
                        print(
                            f"Failed to download {url}: HTTP {response.status_code}")
                except Exception as e:
                    print(f"Error downloading {url}: {e}")


# 메인 실행 부분
if __name__ == "__main__":
    try:
        # JSON 데이터 읽기
        airtable_data = load_json(JSON_FILE_PATH)

        # 이미지 다운로드
        download_images(airtable_data)
        print("All images have been downloaded.")
    except Exception as e:
        print(f"An error occurred: {e}")
