<script setup lang="ts"></script>

<template>
  <div class="external__form--info">
    <div class="info__icon">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_5979_7824)">
          <path
            d="M6 9.75C6.41421 9.75 6.75 9.41421 6.75 9C6.75 8.58579 6.41421 8.25 6 8.25C5.58579 8.25 5.25 8.58579 5.25 9C5.25 9.41421 5.58579 9.75 6 9.75Z"
            fill="#303030"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6 2.25C6.20711 2.25 6.375 2.41789 6.375 2.625V6.75C6.375 6.95711 6.20711 7.125 6 7.125C5.79289 7.125 5.625 6.95711 5.625 6.75V2.625C5.625 2.41789 5.79289 2.25 6 2.25Z"
            fill="#303030"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.5 0.75C1.08579 0.75 0.75 1.08579 0.75 1.5V10.5C0.75 10.9142 1.08579 11.25 1.5 11.25H10.5C10.9142 11.25 11.25 10.9142 11.25 10.5V1.5C11.25 1.08579 10.9142 0.75 10.5 0.75H1.5ZM0 1.5C0 0.671573 0.671573 0 1.5 0H10.5C11.3284 0 12 0.671573 12 1.5V10.5C12 11.3284 11.3284 12 10.5 12H1.5C0.671573 12 0 11.3284 0 10.5V1.5Z"
            fill="#303030"
          />
        </g>
        <defs>
          <clipPath id="clip0_5979_7824">
            <rect width="12" height="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <div class="info__detail">
      <slot />
    </div>
  </div>
</template>
