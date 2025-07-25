<template>
  <div class="card-list-container" :class="getLanguageCssClass()">
    <h1 v-i18n>Cards List</h1>

      <!-- start filters -->

      <div class="search-container">
        <input ref="filter" class="filter" :placeholder="$t('filter')" v-model="filterText">
        <button id="namesOnlyToggle" name="namesOnly" v-on:click="toggleNamesOnly()">
            <span v-if="namesOnly === true" v-i18n>Names only</span>
            <span v-else v-i18n>Full text</span>
        </button>

        <button id="sort-order" v-on:click="toggleSortOrder()" style="width: 85px;">
            <span v-if="sortOrder === 'a'" v-i18n>A-Z</span>
            <span v-else v-i18n>0-9</span>
            &#x2195;
        </button>

        <button id="show-vps-only" v-on:click="toggleVps()" style="width: 63px;">
            <span v-if="vps === 0">all</span>
            <span v-if="vps === 1">VPS</span>
            <span v-if="vps === 2">-VPs</span>
        </button>

        <button id="show-metadata" v-on:click="toggleShowMetadata()" style="width: 30px;">
            <span v-if="showMetadata === true">■</span>
            <span v-else>□</span>
        </button>

        <button id="advanced-search-collapser" v-on:click="toggleAdvancedSearch()">
            <span v-if="showAdvanced === true" v-i18n>Advanced «</span>
            <span v-else v-i18n>Advanced »</span>
        </button>
      </div>

      <div id="selections" v-show="showAdvanced">
        <!-- expansions -->
        <div class="selection-row">
          <button id="toggle-checkbox" v-on:click="invertExpansions()">-</button>

          <span v-for="expansion in allModules" :key="expansion">
            <input type="checkbox" :name="expansion" :id="`${expansion}-checkbox`" v-model="expansions[expansion]">
            <label :for="`${expansion}-checkbox`" class="expansion-button">
              <div class='expansion-icon' :class="expansionIconClass(expansion)"></div>
            </label>
          </span>
        </div>

        <!-- types -->
        <div class="selection-row">
          <button id="toggle-checkbox" v-on:click="invertTypes()">
              <span v-i18n>-</span>
          </button>

          <span v-for="type in allTypes" :key="type">
            <input type="checkbox" :name="`${type}-cardType`" :id="`${type}-cardType-checkbox`" v-model="types[type]">
            <label :for="`${type}-cardType-checkbox`" class="expansion-button">
                <span v-if="type === 'colonyTiles'" v-i18n>Colony Tiles</span>
                <span v-else-if="type === 'globalEvents'" v-i18n>Global Events</span>
                <span v-else v-i18n>{{type}}</span>
            </label>
          </span>
        </div>

        <!-- tags -->
        <div class="selection-row">
          <button id="toggle-checkbox" v-on:click="invertTags()">
              <span v-i18n>-</span>
          </button>
          <span v-for="tag in allTags" :key="tag">
            <input v-if="tag === 'event'" type="checkbox" :name="`${tag}-cardType`" :id="`${tag}-tag-checkbox`" v-model="types.event">
            <input v-else type="checkbox" :name="`${tag}-cardType`" :id="`${tag}-tag-checkbox`" v-model="tags[tag]">
            <label :for="`${tag}-tag-checkbox`" class="expansion-button">
              <!-- a terrible hack, using expansion-icon because card-tag isn't enough to show the tag.-->
              <div :class="`expansion-icon card-tag tag-${tag}`"></div>
            </label>
          </span>
        </div>

        <!-- card resources -->
        <div class="selection-row">
          <button id="toggle-checkbox" v-on:click="invertResources()">
              <span v-i18n>-</span>
          </button>
          <span v-for="resource in allResources" :key="resource">
            <input type="checkbox" :name="`${resource}-cardType`" :id="`${resource}-resource-checkbox`" v-model="resources[resource]">
            <label :for="`${resource}-resource-checkbox`" class="expansion-button">
              <!-- a terrible hack, using expansion-icon because card-resource isn't enough to show the resource.-->
              <div v-if="resource !== 'none'" class="expansion-icon card-resource" :class="cardResourceCSS[resource]"></div>
              <div v-else class="expansion-icon card-tag tag-none"></div>
            </label>
          </span>
        </div>

      </div>
      <!-- start cards -->

      <section class="card-list-cards-list">
          <h2 v-i18n>Project Cards</h2>
          <div class="cardbox" v-for="card in getAllProjectCards()" :key="card">
              <Card v-if="showCard(card)" :card="{'name': card}" />
          </div>
      </section>
      <br>
      <section class="card-list-cards-list">
          <h2 v-i18n>Corporations</h2>
          <div class="cardbox" v-for="card in getAllCorporationCards()" :key="card">
              <Card v-if="showCard(card)" :card="{'name': card}" />
          </div>
      </section>
      <br>
      <section class="card-list-cards-list">
          <h2 v-i18n>Preludes</h2>
          <div class="cardbox" v-for="card in getAllPreludeCards()" :key="card">
              <Card v-if="showCard(card)" :card="{'name': card}" />
          </div>
      </section>
      <br>
      <section class="card-list-cards-list">
          <h2 v-i18n>CEOs</h2>
          <div class="cardbox" v-for="card in getAllCeoCards()" :key="card">
              <Card v-if="showCard(card)" :card="{'name': card}" />
          </div>
      </section>
      <br>
      <section class="card-list-cards-list">
        <h2 v-i18n>Standard Projects</h2>
        <div class="cardbox" v-for="card in getAllStandardProjectCards()" :key="card">
            <Card v-if="showCard(card)" :card="{'name': card}" />
        </div>
      </section>

      <section class="card-list-cards-list">
        <h2 v-i18n>Global Events</h2>
        <template v-if="types.globalEvents">
          <div class="cardbox" v-for="globalEventName in getAllGlobalEvents()" :key="globalEventName">
            <global-event v-if="showGlobalEvent(globalEventName)" :globalEventName="globalEventName" type="distant"></global-event>
          </div>
        </template>
      </section>

      <section>
        <h2 v-i18n>Colonies</h2>
        <template v-if="types.colonyTiles">
          <div class="player_home_colony_cont">
            <div class="player_home_colony" v-for="colonyName in getAllColonyNames()" :key="colonyName">
              <colony v-if="showColony(colonyName)" :colony="colonyModel(colonyName)"></colony>
            </div>
          </div>
        </template>
      </section>

      <section>
        <h2 v-i18n>Milestones</h2>
        <template v-if="types.milestones">
          <div class="player_home_colony_cont">
            <div class="player_home_colony" v-for="milestoneName in allMilestoneNames" :key="milestoneName">
              <div class="milestones"> <!-- This div is necessary for the CSS. Perhaps find a way to remove that?-->
                <milestone v-if="showMilestone(milestoneName)" :milestone="milestoneModel(milestoneName)" :showDescription="true"></milestone>
              </div>
            </div>
          </div>
        </template>
      </section>

      <section>
        <h2 v-i18n>Awards</h2>
        <template v-if="types.awards">
          <div class="player_home_colony_cont">
            <div class="player_home_colony" v-for="awardName in allAwardNames" :key="awardName">
              <div class="awards"> <!-- This div is necessary for the CSS. Perhaps find a way to remove that?-->
                <award v-if="showAward(awardName)" :award="awardModel(awardName)" :showDescription="true"></award>
              </div>
            </div>
          </div>
        </template>
      </section>

      <section>
        <h2 v-i18n>Agendas</h2>
        <template v-if="types.agendas">
          <div class="player_home_colony_cont">
            <div class="player_home_colony" v-for="id in allAgendaIds" :key="id">
              <div class="turmoil_agenda_cont">
                <div style="padding: 12px; background-image: linear-gradient(rgb(156, 96, 45), black); border-radius: 8px; height: 120px;">
                  <turmoil-agenda :id="id"></turmoil-agenda><div style="text-align:center">{{ id }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>

      <div class="free-floating-preferences-icon">
        <preferences-icon></preferences-icon>
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {getEnumStringValues, partition, toName} from '@/common/utils/utils';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {allGlobalEventNames, getGlobalEvent} from '@/client/turmoil/ClientGlobalEventManifest';
import {byType, getCard, getCardOrThrow, getCards} from '@/client/cards/ClientCardManifest';
import {COMMUNITY_COLONY_NAMES, OFFICIAL_COLONY_NAMES, PATHFINDERS_COLONY_NAMES} from '@/common/colonies/AllColonies';
import {ColonyModel} from '@/common/models/ColonyModel';
import {ColonyName} from '@/common/colonies/ColonyName';
import {GameModule, GAME_MODULES} from '@/common/cards/GameModule';
import {Tag} from '@/common/cards/Tag';
import {getColony} from '@/client/colonies/ClientColonyManifest';
import {ClientCard} from '@/common/cards/ClientCard';
import {translateText} from '@/client/directives/i18n';
import {MilestoneName, milestoneNames} from '@/common/ma/MilestoneName';
import {AwardName, awardNames} from '@/common/ma/AwardName';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';
import {FundedAwardModel} from '@/common/models/FundedAwardModel';
import {WithRefs} from 'vue-typed-refs';
import {TypeOption, CardListModel, hashToModel, modelToHash, ResourceOption, TagOption} from '@/client/components/cardlist/CardListModel';
import {getAward, getMilestone} from '@/client/MilestoneAwardManifest';
import {BonusId, BONUS_IDS, PolicyId, POLICY_IDS} from '@/common/turmoil/Types';
import Card from '@/client/components/card/Card.vue';
import Colony from '@/client/components/colonies/Colony.vue';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import Milestone from '@/client/components/Milestone.vue';
import Award from '@/client/components/Award.vue';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';
import {CardResource} from '@/common/CardResource';
import {cardResourceCSS} from '../common/cardResources';

type Refs = {
  filter: HTMLInputElement,
};

export default (Vue as WithRefs<Refs>).extend({
  name: 'card-list',
  components: {
    Card,
    GlobalEvent,
    Colony,
    Milestone,
    Award,
    TurmoilAgenda,
    PreferencesIcon,
  },
  data(): CardListModel {
    return hashToModel(window.location.hash);
  },
  mounted() {
    this.$refs.filter.focus();
    this.delayedSetLocationHash();
  },
  computed: {
    allModules(): ReadonlyArray<GameModule> {
      return GAME_MODULES;
    },
    allTypes(): Array<TypeOption> {
      return [
        CardType.EVENT,
        CardType.ACTIVE,
        CardType.AUTOMATED,
        CardType.PRELUDE,
        CardType.CORPORATION,
        CardType.STANDARD_PROJECT,
        CardType.CEO,
        'colonyTiles',
        'globalEvents',
        'milestones',
        'awards',
        'agendas',
      ];
    },
    allTags(): Array<TagOption> {
      const results: Array<TagOption> = [];
      for (const tag in Tag) {
        if (Object.prototype.hasOwnProperty.call(Tag, tag)) {
          results.push((<any>Tag)[tag]);
        }
      }
      return results.concat('none');
    },
    allResources(): Array<ResourceOption> {
      return [...getEnumStringValues(CardResource), 'none'];
    },
    allMilestoneNames(): ReadonlyArray<MilestoneName> {
      return [...milestoneNames].sort();
    },
    allAwardNames(): ReadonlyArray<AwardName> {
      return [...awardNames].sort();
    },
    allAgendaIds(): ReadonlyArray<PolicyId | BonusId> {
      const ids = (POLICY_IDS as ReadonlyArray<PolicyId | BonusId>).concat(BONUS_IDS);
      const [official, expansion] = partition(ids, (id) => id.endsWith('01'));
      official.sort(); // This puts matching party content together.
      expansion.sort();
      return [...official, ...expansion];
    },
    cardResourceCSS(): typeof cardResourceCSS {
      return cardResourceCSS;
    },
  },
  methods: {
    delayedSetLocationHash(delayms: number = 200) {
      setTimeout(() => {
        const changed = this.setLocationHash();
        this.delayedSetLocationHash(changed ? 10 : 100);
      }, delayms);
    },
    setLocationHash(): boolean {
      const hash = modelToHash(this);
      const changed = hash !== window.location.hash;
      window.location.hash = hash;
      return changed;
    },
    invertExpansions() {
      GAME_MODULES.forEach((module) => this.expansions[module] = !this.expansions[module]);
    },
    invertTags() {
      this.allTags.forEach((tag) => this.tags[tag] = !this.tags[tag]);
    },
    invertResources() {
      this.allResources.forEach((resource) => this.resources[resource] = !this.resources[resource]);
    },
    invertTypes() {
      this.allTypes.forEach((type) => this.types[type] = !this.types[type]);
    },
    sort<T extends string>(names: Array<T>): Array<T> {
      if (this.sortOrder === 'a') {
        const translated = names.map((name) => ({name: name, text: translateText(name)}));
        translated.sort((a, b) => a.text.localeCompare(b.text));
        return translated.map((e) => e.name);
      } else {
        const numbered = names.map((name) => ({name: name, number: getCardOrThrow(name as CardName).metadata.cardNumber ?? ''}));
        numbered.sort((a, b) => a.number.localeCompare(b.number));
        return numbered.map((e) => e.name);
      }
    },
    getAllStandardProjectCards() {
      const names = getCards(byType(CardType.STANDARD_PROJECT)).map(toName);
      return this.sort(names);
    },
    getAllProjectCards() {
      const names: Array<CardName> = [];
      names.push(...getCards(byType(CardType.AUTOMATED)).map(toName));
      names.push(...getCards(byType(CardType.ACTIVE)).map(toName));
      names.push(...getCards(byType(CardType.EVENT)).map(toName));
      return this.sort(names);
    },
    getAllCorporationCards() {
      const names = getCards(byType(CardType.CORPORATION)).map(toName);
      return this.sort(names);
    },
    getAllPreludeCards() {
      const names = getCards(byType(CardType.PRELUDE)).map(toName);
      return this.sort(names);
    },
    getAllCeoCards() {
      const names = getCards(byType(CardType.CEO)).map(toName);
      return this.sort(names);
    },
    getAllGlobalEvents() {
      if (this.sortOrder === 'a') {
        return this.sort(Array.from(allGlobalEventNames()));
      } else {
        return Array.from(allGlobalEventNames());
      }
    },
    getAllColonyNames() {
      return OFFICIAL_COLONY_NAMES.concat(COMMUNITY_COLONY_NAMES).concat(PATHFINDERS_COLONY_NAMES);
    },
    include(name: string, type: 'card' | 'globalEvent' | 'colony' | 'ma') {
      const normalized = this.filterText.toLocaleUpperCase();
      if (normalized.length === 0) {
        return true;
      }
      if (this.namesOnly) {
        return name.toLocaleUpperCase().includes(normalized);
      } else {
        return this.searchIndex.matches(this.filterText, type, name);
      }
    },
    expansionIconClass(expansion: GameModule): string {
      switch (expansion) {
      case 'base': return 'expansion-icon-base';
      case 'corpera': return 'expansion-icon-CE';
      case 'colonies': return 'expansion-icon-colony';
      case 'moon': return 'expansion-icon-themoon';
      default: return `expansion-icon-${expansion}`;
      }
    },
    filterByTags(card: ClientCard): boolean {
      if (card.tags.length === 0) {
        return this.tags['none'] === true;
      }

      let matches = false;
      for (const tag of card.tags) {
        if (this.tags[tag]) matches = true;
      }
      return matches;
    },
    showCard(cardName: CardName): boolean {
      if (!this.include(cardName, 'card')) return false;

      const card = getCard(cardName);
      if (card === undefined) {
        return false;
      }

      if (!this.filterByTags(card)) return false;
      if (!this.types[card.type]) return false;
      if (card.resourceType === undefined) {
        if (this.resources.none === false) {
          return false;
        }
      } else {
        if (!this.resources[card.resourceType]) return false;
      }
      switch (this.vps) {
      case 1:
        if (card.victoryPoints === undefined) {
          return false;
        }
        break;
      case 2:
        if (card.victoryPoints !== undefined) {
          return false;
        }
        break;
      }
      return this.expansions[card.module] === true;
    },
    showGlobalEvent(name: GlobalEventName): boolean {
      if (!this.include(name, 'globalEvent')) return false;
      const globalEvent = getGlobalEvent(name);
      return globalEvent !== undefined && this.expansions[globalEvent.module] === true;
    },
    showColony(name: ColonyName): boolean {
      if (!this.include(name, 'colony')) return false;
      const colony = getColony(name);
      return colony !== undefined && this.expansions[colony.module ?? 'base'] === true;
    },
    showMilestone(name: MilestoneName): boolean {
      if (!this.include(name, 'ma')) {
        return false;
      }
      return this.expansions[getMilestone(name).requirements ?? 'base'] === true;
    },
    showAward(name: AwardName): boolean {
      if (!this.include(name, 'ma')) {
        return false;
      }
      return this.expansions[getAward(name).requirements ?? 'base'] === true;
    },
    getLanguageCssClass() {
      const language = getPreferences().lang;
      return 'language-' + language;
    },
    colonyModel(colonyName: ColonyName): ColonyModel {
      return {
        colonies: this.showMetadata ? ['red', 'blue'] : [],
        isActive: this.showMetadata,
        name: colonyName,
        trackPosition: 3,
        visitor: undefined,
      };
    },
    milestoneModel(name: MilestoneName): ClaimedMilestoneModel {
      return {name, playerName: undefined, playerColor: undefined, scores: []};
    },
    awardModel(name: AwardName): FundedAwardModel {
      return {name, playerName: undefined, playerColor: undefined, scores: []};
    },
    // experimentalUI might not be used at the moment, but it's fine to just leave it here.
    experimentalUI(): boolean {
      return getPreferences().experimental_ui;
    },
    toggleNamesOnly(): void {
      this.namesOnly = !this.namesOnly;
    },
    toggleAdvancedSearch(): void {
      this.showAdvanced = !this.showAdvanced;
    },
    toggleSortOrder(): void {
      this.sortOrder = this.sortOrder === 'a' ? '1' : 'a';
    },
    toggleVps(): void {
      this.vps = (this.vps + 1) % 3;
    },
    toggleShowMetadata(): void {
      this.showMetadata = !this.showMetadata;
    },
  },
});

</script>
