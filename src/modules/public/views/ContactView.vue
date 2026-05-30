<template>
  <div>
    <section class="bg-gradient-to-br from-base-200 to-base-100 py-20 text-center">
      <div class="max-w-2xl mx-auto px-6">
        <h1 class="text-5xl font-black mb-4">Get in touch</h1>
        <p class="text-base-content/60 text-lg">Have questions? We'd love to hear from you.</p>
      </div>
    </section>

    <section class="py-20 max-w-2xl mx-auto px-6">
      <div class="card bg-base-100 border border-base-200 shadow-sm">
        <div class="card-body">
          <form v-if="!sent" @submit.prevent="onSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text">Name</span></label>
                <input v-model="form.name" class="input input-bordered" required placeholder="Your name" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text">Email</span></label>
                <input v-model="form.email" type="email" class="input input-bordered" required placeholder="you@example.com" />
              </div>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Subject</span></label>
              <input v-model="form.subject" class="input input-bordered" required placeholder="How can we help?" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Message</span></label>
              <textarea v-model="form.message" class="textarea textarea-bordered" rows="5" required placeholder="Tell us more…" />
            </div>
            <button type="submit" class="btn btn-primary w-full" :disabled="sending">
              <span v-if="sending" class="loading loading-spinner loading-sm" />
              Send Message
            </button>
          </form>

          <div v-else class="text-center py-12">
            <div class="text-5xl mb-4">✉️</div>
            <h3 class="text-2xl font-black mb-2">Message sent!</h3>
            <p class="text-base-content/60">We'll get back to you within 24 hours.</p>
            <button class="btn btn-ghost mt-6" @click="sent = false">Send another</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const sent = ref(false)
const sending = ref(false)
const form = reactive({ name: '', email: '', subject: '', message: '' })

async function onSubmit() {
  sending.value = true
  await new Promise(r => setTimeout(r, 900))
  sending.value = false
  sent.value = true
}
</script>
