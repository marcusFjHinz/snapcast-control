<template>
  <div>
    <div
        :class="{stream_card_active: (!player.is_idle)}"
        class="text-primary stream-card"
    >
      <q-toolbar>
        <q-btn color="black" disabled="true" flat size="2rem">{{ player.name }}</q-btn>
        <q-space></q-space>
        <q-btn v-if="player.is_idle" color="black" dense flat icon="hearing_disabled" round size="lg"></q-btn>
        <q-btn v-else :label="player.stream_id" color="black" dense flat icon="hearing" round size="lg"></q-btn>
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
          <q-btn class="control-button control-button-secondary" dense flat
                 icon="trending_flat" @click="show_stream_chooser_dialog = true"></q-btn>
          <q-btn v-if="!player.is_idle"
                 class="control-button control-button-secondary" dense flat
                 icon="stop" @click="stop_player()"></q-btn>
          <q-btn class="control-button control-button-small" flat dense icon="chevron_left"
                 @click="swipe_left()"></q-btn>
        </q-toolbar>
        <q-toolbar class="absolute" style="top:1rem">
          <q-space></q-space>
          <q-btn class="control-button control-button-secondary" flat
                 icon="drive_file_rename_outline" @click="rename_player()"></q-btn>
          <q-btn class="control-button control-button-secondary" flat
                 icon="delete" @click="rename_player()"></q-btn>
        </q-toolbar>

      </div>
    </div>
    <stream_chooser_dialog
        v-model="show_stream_chooser_dialog"
        v-bind:chosen_player="get_player()"></stream_chooser_dialog>
    <rename_player
        v-model="show_rename_player_dialog"
        v-bind:chosen_player="get_player()">
    </rename_player>
  </div>
</template>

<script lang="ts">
import {Player} from "@/model/Player";
import {defineComponent, inject, ref} from "vue";
import {snapcast_service} from "@/services/snapcast_service";
import stream_chooser_dialog from "@/dialogs/stream_chooser_dialog.vue"
import rename_player from "@/dialogs/rename_player.vue"

export default defineComponent({
  name: "player_view_item",
  components: {
    stream_chooser_dialog,
    rename_player
  },
  props: {
    player: {
      type: Player,
      required: true,
    },
  },
  setup(props) {
    const snapcastService = (inject('snapcast_service') as snapcast_service);

    const show_stream_chooser_dialog = ref(false);
    const show_rename_player_dialog = ref(false);

    const swipe_offset = ref(0);
    const swipe_to_offset = -70;

    const swipe_left = () => {
      swipe_offset.value = swipe_to_offset;
    }
    const swipe_right = () => {
      swipe_offset.value = 0;
    }
    const stop_player = (): void => {
      snapcastService.stop_player(props.player);
    }

    const rename_player = (): void => {
      swipe_offset.value = 0;
      show_rename_player_dialog.value = true
    }

    const get_player = (): Player => {
      return props.player;
    }

    return {
      show_stream_chooser_dialog,
      show_rename_player_dialog,
      swipe_offset,
      swipe_left,
      swipe_right,
      stop_player,
      get_player,
      rename_player,
    }
  }

});
</script>

<style scoped>

</style>