<template>
  <q-page-container>
    <q-page class="main-container main-container-dialog">
      <div id="actions" class="bg-green-3">
        <q-tabs v-model="tab" dense>
          <q-tab label="Streams" name="streams"></q-tab>
          <q-tab label="Player" name="players"></q-tab>
          <q-btn icon="refresh" flat dense @click="reload"></q-btn>
        </q-tabs>
      </div>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="streams">
          <snapcast_streams/>
        </q-tab-panel>
        <q-tab-panel name="players">
          <snapcast_players/>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </q-page-container>

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import snapcast_players from '@/components/snapcast_players.vue';
import snapcast_streams from "@/components/snapcast_streams.vue"; // @ is an alias to /src

export default defineComponent({
  name: 'main_view',
  components: {
    snapcast_streams,
    snapcast_players
  },
  setup() {
    const show_handle_player_list_dialog = ref(false);

    const reload = (): void => {
      //snapcastHelper.write_config();

      location.reload();
    }
    return {
      tab: ref('streams'),
      reload,
      show_handle_player_list_dialog
    }
  }
});
</script>
