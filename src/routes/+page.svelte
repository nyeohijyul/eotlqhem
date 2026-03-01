<script>
    import Add from "$lib/add.svelte";
    import Inprogress from "$lib/inprogress.svelte";
    import Queue from "$lib/queue.svelte";
    import Logout from "$lib/logout.svelte";

    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { auth } from '$lib/firebase';
    import { getAuth } from "firebase/auth";
    import { signOut } from 'firebase/auth';

    import { ref, set, get, push } from 'firebase/database';
    import { db } from '$lib/firebase';


    let currentAuth;
    let uid;

    let trueAuth = false;

    let email = '';
    let password = '';
    let error = '';

    async function login() {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            trueAuth = true;
            currentAuth = getAuth();
            uid = currentAuth.currentUser.uid;
        } catch (e) {
            error = '로그인 실패';
            console.error(e);
        }
    }
    
    async function logout() {
        try {
            await signOut(auth);
            trueAuth = false;
            dispatch("logout")
            currentAuth = '';
            uid = '';
            
            autoload = false;
            clicked = 1;
            currentEdit = '';
        } catch (e) {
            console.error(e);
        }
    }
</script>

{#if trueAuth}
<Inprogress />
<Queue />
<Add />
<Logout on:logout={logout} />
{:else}
<div id="container">
    <div id="Loginpage">
        <input type="email" bind:value={email} placeholder="이메일" />
        <input type="password" bind:value={password} placeholder="비밀번호" />
        <button on:click={login}>로그인</button>
    </div>
    <div id="NotanAuth">
        로그인되지 않음<br>
        개발자에게 계정발급을 신청하세요
    </div>
</div>

{/if}

<style>
    #container {
        margin: 20px;
        padding: 20px;
        background-color: white;
        width: calc(100vw - 40px);
        height: calc(100vh - 40px);
    }
</style>