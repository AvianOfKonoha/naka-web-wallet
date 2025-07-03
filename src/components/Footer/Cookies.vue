<script setup lang="ts"></script>

<template>
  <div
    class="CookieConsent"
    style="
      align-items: center;
      background: rgb(235, 242, 248);
      color: white;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      left: 0px;
      position: fixed;
      width: 100%;
      z-index: 2147483647;
      padding: 1px 16px 1px 1px;
      border-radius: 4px;
      border: 1px solid rgb(214, 222, 229);
      max-width: 920px;
      margin-bottom: 72px;
      bottom: 0px;
      right: 0px;
      margin-left: auto;
      margin-right: auto;
    "
  >
    <div
      style="flex: 1 0 300px; margin: 15px; height: fit-content"
      class="CookieConsent_cookie__8mtWY"
    >
      <div class="CookieConsent_cookieConsent__viO_0">
        <img
          alt="Cookie icon"
          loading="lazy"
          width="72"
          height="72"
          decoding="async"
          data-nimg="1"
          style="color: transparent"
          src="/_next/static/media/cookie.f9818f5e.svg"
        />
        <div class="CookieConsent_textWrapper__ahGcr">
          <span class="CookieConsent_title__qgS_e"
            >Indulge in a DApp Treat! 🍪</span
          >
          <div>
            <span class="CookieConsent_description__sH9dL"
              >Welcome to our DApp! By accepting our cookies, you enable us to
              enhance your experience. Tap 'Accept All' for an optimised
              journey. </span
            ><a
              href="https://s3.eu-central-1.amazonaws.com/public.naka.com/Legal/terms+and+conditions+NAKA+dApp.pdf"
              class="CookieConsent_link__JcJok"
              target="_blank"
              >To learn more press here.</a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="CookieConsent_buttonWrapper__KAbOv">
      <button
        style="
          background: rgb(214, 222, 229);
          border: 1px solid rgb(214, 222, 229);
          border-radius: 28px;
          box-shadow: none;
          color: rgb(91, 100, 101);
          cursor: pointer;
          flex: 0 0 auto;
          padding: 8px 48px;
          margin: 0px;
          font-weight: 600;
          font-size: 10px;
        "
        class="CookieConsent_decline__B1GOp"
        id="rcc-decline-button"
        aria-label="Decline cookies"
      >
        Decline All</button
      ><button
        style="
          background: rgb(255, 255, 255);
          border: 1px solid rgb(41, 63, 255);
          border-radius: 28px;
          box-shadow: none;
          color: rgb(44, 49, 49);
          cursor: pointer;
          flex: 0 0 auto;
          padding: 8px 48px;
          margin: 0px;
          font-weight: 600;
          font-size: 10px;
        "
        class=""
        id="rcc-confirm-button"
        aria-label="Accept cookies"
      >
        Accept All
      </button>
    </div>
  </div>
</template>
