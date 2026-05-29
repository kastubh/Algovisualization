import pytest


async def auth_headers(client):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "viz@example.com", "username": "vizuser", "password": "SecurePass123!"},
    )
    login = await client.post("/api/v1/auth/login", json={"email": "viz@example.com", "password": "SecurePass123!"})
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_visualize_history_and_share_with_demo_key(client):
    headers = await auth_headers(client)

    save_key = await client.post("/api/v1/keys", json={"provider": "openai", "api_key": "demo-local-key"}, headers=headers)
    assert save_key.status_code == 200
    assert save_key.json()["key_hint"] == "...-key"

    visualize = await client.post(
        "/api/v1/algorithms/visualize",
        json={"algorithm_text": "Bubble sort numbers", "provider": "openai", "model": "gpt-4o-mini"},
        headers=headers,
    )
    assert visualize.status_code == 200
    body = visualize.json()
    assert body["viz_data"]["algorithm_type"] == "sorting"

    history = await client.get("/api/v1/algorithms/history", headers=headers)
    assert history.status_code == 200
    assert history.json()["total"] == 1

    share = await client.post(f"/api/v1/share/{body['history_id']}", headers=headers)
    assert share.status_code == 200
    shared = await client.get(f"/api/v1/share/{share.json()['share_token']}")
    assert shared.status_code == 200
    assert shared.json()["title"] == "Bubble Sort Demo"

    tutor = await client.post(
        f"/api/v1/visualizations/{body['history_id']}/tutor-script",
        json={"provider": "openai", "model": "gpt-4o-mini", "voice_style": "friendly"},
        headers=headers,
    )
    assert tutor.status_code == 200
    script = tutor.json()
    assert script["visualization_id"] == body["history_id"]
    assert script["steps"][0]["spoken_text"]
