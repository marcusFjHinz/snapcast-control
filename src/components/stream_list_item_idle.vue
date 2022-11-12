<template>
  <div>
    <div class="text-primary stream-card">
      <q-toolbar>
        <div class="stream-label">{{ stream.name }}</div>
        <q-space></q-space>
        <q-btn class="control-button control-button-single" flat dense @click="show_player_manager = true"
               icon="add"></q-btn>
      </q-toolbar>
    </div>

    <player_manager
        v-bind:stream="props.stream"
        v-model="show_player_manager"
        :players_in_stream="players_in_stream"
        :players_not_in_stream="players_not_in_stream"></player_manager>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, inject, ref} from "vue";
import {snapcast_service} from "@/services/snapcast_service";

import {Stream} from "@/model/Stream";
import player_manager from "@/dialogs/player_manager.vue";


export default defineComponent({
  name: "stream_list_item_idle",
  components: {
    player_manager
  },
  props: {
    stream: {
      type: Stream,
      required: true
    },
  },
  setup(props) {
    const snapcastService = (inject('snapcast_service') as snapcast_service);
    const players = snapcastService.players;

    const show_player_manager = ref(false);

    const players_in_stream = computed(() => players.value.filter((p) => p.stream_id === props.stream.id));
    const players_not_in_stream = computed(() => players.value.filter((p) => p.stream_id !== props.stream.id));


    return {
      players_in_stream,
      players_not_in_stream,
      show_player_manager,
      props
    }

  }
});
</script>

<style scoped>

</style>