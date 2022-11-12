<template>
  <q-dialog class="no-scrollbar">
    <div class="main-container main-container-dialog">
      <q-card>
        <q-card-actions class="stream-label-dialog">
          <div class="stream-label">{{ stream.id }}</div>
          <q-space></q-space>
          <q-btn size="xl" v-close-popup flat color="primary" label="ok"></q-btn>
        </q-card-actions>
        <q-card-section>
          <div v-for="player in players_in_stream" :key="player.id" class="text-primary stream-card stream_card_active">
            <q-btn flat color="black" disabled="true" size="2rem">{{ player.name }}</q-btn>
            <q-space></q-space>
            <q-toolbar>
              <q-btn class="control-button" flat dense v-if="player.is_muted"
                     @click="toggle_mute_player(player)" icon="volume_off"></q-btn>
              <q-btn class="control-button" flat dense v-if="!player.is_muted"
                     @click="toggle_mute_player(player)" icon="volume_up"></q-btn>
              <q-btn class="control-button" flat dense
                     @click="volume_down_one_notch(player)"
                     v-touch-repeat:500:100:100.mouse="volume_down(player)" icon="south"></q-btn>
              <q-btn size="1.5rem" flat dense :label="pad(String(player.volume), 2) + '%'"></q-btn>
              <q-btn class="control-button" flat dense
                     @click="volume_up_one_notch(player)"
                     v-touch-repeat:500:100:100.mouse="volume_up(player)" icon="north"></q-btn>
            </q-toolbar>
            <q-toolbar>
              <q-space></q-space>

              <q-btn class="control-button control-button-secondary" flat dense
                     @click="show_stream_chooser_dialog = true" icon="trending_flat"></q-btn>

              <q-btn class="control-button control-button-secondary" flat dense
                     @click="stop_player(player)" icon="stop"></q-btn>
            </q-toolbar>
            <stream_chooser_dialog
                v-model = "show_stream_chooser_dialog"
                v-bind:chosen_player="player"></stream_chooser_dialog>
          </div>
        </q-card-section>
        <q-card-section v-for="player in players_not_in_stream" :key="player.id">
          <div class="text-primary stream-card" :class="{stream_card_active_other: (!player.is_idle)}">
            <q-btn flat color="black" disabled="true" size="2rem">{{ player.name }}</q-btn>
            <q-toolbar>
              <q-btn v-if="player.is_idle" size="lg" color="black" flat round dense icon="hearing_disabled"></q-btn>
              <q-btn v-else size="lg" color="black" flat round dense icon="hearing" :label="player.stream_id"></q-btn>
              <q-space></q-space>
              <q-btn class="control-button control-button-secondary" flat dense
                     @click="add_to_stream(player, stream)" icon="add"></q-btn>
            </q-toolbar>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-dialog>
</template>


<script lang="ts">
import {defineComponent, ref, inject, computed} from "vue";
import {Player} from "@/model/Player";
import {snapcast_service} from "@/services/snapcast_service";
import {Stream} from "@/model/Stream";
import { format } from 'quasar'
import stream_chooser_dialog from "@/dialogs/stream_chooser_dialog.vue";
const { pad } = format


export default defineComponent({
  name: 'player_manager',
  components: {stream_chooser_dialog},
  props: {
    stream: Stream,
    players_in_stream: {
      required: true,
      type: Object
    },
    players_not_in_stream: Object
  },
  setup() {

    const snapcastService = (inject('snapcast_service') as snapcast_service);

    const show_stream_chooser_dialog = ref(false);

    const volume_step = 2;
    const all_streams_ref = snapcastService.streams;


    const all_streams = computed(() =>
        all_streams_ref.value.map(st => (st as Stream))
    );
    const toggle_mute_player = (player: Player): void => {
      snapcastService.toggle_mute_player(player);
    }

    const stop_player = (player: Player): void => {
      snapcastService.stop_player((player as Player));
    }
    const volume_up = (player: Player) => {
      return () => {
        snapcastService.update_player_volume(player, volume_step);
      }
    }
    const volume_up_one_notch = (player: Player) => {
      snapcastService.update_player_volume(player, 1);
    }
    const volume_down = (player: Player) => {
      return () => {
        snapcastService.update_player_volume(player, -volume_step);
      }
    }
    const volume_down_one_notch = (player: Player) => {
      snapcastService.update_player_volume(player, -1);
    }

    const add_to_stream = (player: Player, stream: Stream): void => {
      snapcastService.set_stream_for_player(stream, player);
    }

    return {
      toggle_mute_player,
      stop_player,
      add_to_stream,
      volume_up,
      volume_down,
      volume_up_one_notch,
      volume_down_one_notch,
      all_streams,
      show_stream_chooser_dialog,
      pad
    }
  }
});
</script>

<style scoped>

</style>