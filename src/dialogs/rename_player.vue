<template>
  <q-dialog class="dialog">
    <div>
      <q-card class="player-card">
        <q-card-section>
          <q-input style="height: 2rem;font-size: x-large; margin-bottom: .5rem" v-model="new_name"></q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn v-close-popup @click="set_player_name()" class="bg-primary" flat dense>rename</q-btn>
          <q-btn v-close-popup class="bg-primary" flat dense>cancel</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {Player} from "@/model/Player";
import {defineComponent, inject, ref} from "vue";
import {snapcast_service} from "@/services/snapcast_service";

export default defineComponent({
  name: "rename_player",
  props:{
    chosen_player:{
      type: Player,
      required: true,
    },
  },
  setup(props) {
    const snapcastService = (inject('snapcast_service') as snapcast_service);
    const player_ref = ref(props.chosen_player);
    const new_name = ref(props.chosen_player.name);

    const set_player_name = (): void => {
      snapcastService.persist_player_name(props.chosen_player, new_name.value);
    }

    return{
      player_ref,
      set_player_name,
      new_name
    }
  }
});
</script>

<style scoped>

</style>