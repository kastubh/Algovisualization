import pytest


@pytest.mark.asyncio
async def test_register_login_and_me(client):
    register = await client.post(
        "/api/v1/auth/register",
        json={"email": "student@example.com", "username": "student", "password": "SecurePass123!"},
    )
    assert register.status_code == 201

    login = await client.post("/api/v1/auth/login", json={"email": "student@example.com", "password": "SecurePass123!"})
    assert login.status_code == 200
    tokens = login.json()
    assert tokens["access_token"]
    assert tokens["refresh_token"]

    me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert me.status_code == 200
    assert me.json()["email"] == "student@example.com"
