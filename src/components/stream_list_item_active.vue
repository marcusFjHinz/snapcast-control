<template>
  <div class="text-primary stream-card stream_card_active">
    <div class="stream-label">{{ stream.name }}</div>

    <q-toolbar>
      <q-btn class="control-button" flat dense v-if="is_muted" @click="toggle_mute_stream()"
             icon="volume_off"></q-btn>
      <q-btn class="control-button" flat dense v-if="!is_muted" @click="toggle_mute_stream()"
             icon="volume_up"></q-btn>
      <q-btn class="control-button" flat dense
             @click="volume_down_one_notch_stream()"
             v-touch-repeat:500:100:100.mouse="volume_down_stream()"
             icon="south"></q-btn>
      <q-btn size="xl" flat dense :label="pad(String(stream_volume), 2) + '%'"></q-btn>
      <q-btn class="control-button" flat dense
             @click="volume_up_one_notch_stream()"
             v-touch-repeat:500:100:100.mouse="volume_up_stream()"
             icon="north"></q-btn>
    </q-toolbar>
    <div style="position: relative">
      <q-toolbar
          v-touch-swipe.mouse.left.prevent="swipe_left"
          v-touch-swipe.mouse.right.prevent="swipe_right"
          :style="`transform: translateX(${swipe_offset}%);
        transition: transform 0.5s, background-color 0.5s`"
          style="z-index: 2000; background-color: rgb(150, 150, 150)"

      >
        <q-space></q-space>
        <q-btn class="control-button control-button-secondary" flat dense @click="show_choose_stream_dialog = true"
               icon="trending_flat"></q-btn>
        <q-btn class="control-button control-button-secondary" flat dense @click="stop_stream()"
               icon="stop"></q-btn>
        <q-btn class="control-button control-button-secondary" flat dense @click="show_player_manager = true"
               icon="speaker">
          <q-badge floating color="red">{{ player_count }}</q-badge>
        </q-btn>
      </q-toolbar>
      <q-toolbar class="absolute" style="top:0">
        <q-space></q-space>
        <q-btn class="control-button control-button-secondary" flat
               icon="drive_file_rename_outline" @click="rename_player()"></q-btn>
        <q-btn class="control-button control-button-secondary" flat
               icon="delete" @click="delete_stream()"></q-btn>
      </q-toolbar>

    </div>
  </div>


  <stream_chooser_dialog
      v-bind:chosen_stream="props.stream"
      v-model="show_choose_stream_dialog"></stream_chooser_dialog>

  <player_manager
      v-bind:stream="props.stream"
      v-model="show_player_manager"
      :players_in_stream="players_in_stream"
      :players_not_in_stream="players_not_in_stream"></player_manager>

</template>

<script lang="ts">
import {computed, defineComponent, inject, ref} from "vue";
import {snapcast_service} from "@/services/snapcast_service";
import {format} from 'quasar'

const {pad} = format;

import {Stream} from "@/model/Stream";
import stream_chooser_dialog from "@/dialogs/stream_chooser_dialog.vue";
import player_manager from "@/dialogs/player_manager.vue";


export default defineComponent({
  name: "stream_list_item_active",
  components: {
    stream_chooser_dialog,
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

    const show_choose_stream_dialog = ref(false);
    const show_player_manager = ref(false);

    const volume_step = 2;

    const swipe_offset = ref(0);
    const swipe_to_offset = -70;


    const player_count = computed(() => players.value.filter((p) => p.stream_id === props.stream.id).length);
    const players_in_stream = computed(() => players.value.filter((p) => p.stream_id === props.stream.id));
    const players_not_in_stream = computed(() => players.value.filter((p) => p.stream_id !== props.stream.id));
    const is_muted = computed(() => snapcastService.is_muted_stream(props.stream));
    const stream_volume = computed(() => snapcastService.get_stream_volume(props.stream));

    const toggle_mute_stream = (): void => {
      snapcastService.toggle_mute_stream(props.stream);
    }

    const volume_up_one_notch_stream = () => {
      snapcastService.change_stream_volume(props.stream, 1);
    }

    const volume_down_one_notch_stream = () => {
      snapcastService.change_stream_volume(props.stream, -1);
    }

    //the return is not necessary --> one can pass parameters to the function writing it this way
    const volume_up_stream = () => {
      return () => {
        snapcastService.change_stream_volume(props.stream, volume_step);
      }
    }
    const volume_down_stream = () => {
      return () => {
        snapcastService.change_stream_volume(props.stream, -volume_step);
      }
    }

    const stop_stream = (): void => {
      snapcastService.stop_stream(props.stream);
    }
    const swipe_left = () => {
      swipe_offset.value = swipe_to_offset;
    }
    const swipe_right = () => {
      swipe_offset.value = 0;
    }

    const delete_stream = () => {
      snapcastService.delete_stream(props.stream);
    }



    return {
      is_muted,
      stream_volume,
      player_count,
      players_in_stream,
      players_not_in_stream,
      show_choose_stream_dialog,
      show_player_manager,
      toggle_mute_stream,
      volume_up_one_notch_stream,
      volume_down_one_notch_stream,
      volume_up_stream,
      volume_down_stream,
      stop_stream,
      delete_stream,
      props,
      pad,
      swipe_left,
      swipe_right,
      swipe_offset,
    }

  }
});
</script>

<style scoped>

</style>