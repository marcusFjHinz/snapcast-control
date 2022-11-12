<template>
  <q-dialog class="dialog">
    <div>
      <q-card class="player-card">
        <q-card-section>
          <q-input style="height: 2rem;font-size: x-large; margin-bottom: .5rem" v-model="stream_name" label="name"></q-input>
          <q-input style="height: 2rem;font-size: x-large; margin-bottom: .5rem" v-model="url" label="url"></q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn v-close-popup @click="add_stream()" class="bg-primary" label="add stream" flat dense></q-btn>
          <q-btn v-close-popup class="bg-primary" flat dense>cancel</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent, inject, ref} from "vue";
import {snapcast_service} from "@/services/snapcast_service";

export default defineComponent({
  name: "add_stream_dialog",
  setup() {
    const snapcastService = (inject('snapcast_service') as snapcast_service);
    const url = ref("");
    const stream_name = ref("");
    const show_add_stream = ref(false);

    const add_stream = (): void => {
      snapcastService.add_stream(url.value, stream_name.value);
    }

    return{
      url,
      stream_name,
      show_add_stream,
      add_stream,
    }
  }
});
</script>

<style scoped>

</style>