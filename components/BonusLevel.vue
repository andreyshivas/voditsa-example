<template>
  <div class="bonusLevel">
    <div class="bonusLevel__title">
      <h4>Всего накоплено: {{totalBonuses}}</h4>
    </div>
    <div class="bonusLevel__wrapper">
      <div class="bonusLevel__bar-wrapper">
        <div class="bonusLevel__bar-top">
          <div class="bonusLevel__bar-title">
            Персональная скидка
          </div>
          <div class="bonusLevel__bar-info" v-if="this.levelInfo.levelEnd === 0">
            Максимальная
          </div>
          <div class="bonusLevel__bar-info" v-else>
            Еще {{needBonuses}} до {{this.levelInfo.level + 1}}%
          </div>
        </div>

        <div class="bonusLevel__bar">
          <div class="bonusLevel__bar-value" :style="`width: ${progress}%`"></div>
        </div>
      </div>
      <div class="bonusLevel__level">{{this.levelInfo.level}}%</div>
    </div>
  </div>
</template>

<script>
import bonusLevels from '~/helpers/bonusLevels';
import declOfNum from "~/helpers/declOfNum";

export default {
  computed: {
    bonuses() {
      return this.$store.state.userProfile.bonuses;
    },
    levelInfo() {
      return bonusLevels(this.bonuses);
    },
    needBonuses() {
      const needBonuses = this.levelInfo.levelEnd - this.bonuses;
      const needBonusesText = declOfNum(needBonuses, ['балл', 'балла', 'баллов']);
      return `${needBonuses} ${needBonusesText}`;
    },
    totalBonuses() {
      const needBonusesText = declOfNum(this.bonuses, ['балл', 'балла', 'баллов']);
      return `${this.bonuses} ${needBonusesText}`;
    },
    progress() {
      if (this.levelInfo.levelEnd === 0) {
        return 100;
      }
      const progress = this.bonuses - this.levelInfo.levelStart;
      const percent = Math.round((100 / (this.levelInfo.levelEnd - this.levelInfo.levelStart)) * progress);
      return percent;
    }
  },
}
</script>

<style lang="scss">
.bonusLevel {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 480px;
  }

  &__bar-wrapper {
    flex: 1;
  }

  &__bar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    @media screen and (max-width: 767px) {
      display: block;
    }
  }

  &__bar-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;

    @media screen and (max-width: 767px) {
      margin-bottom: 5px;
    }
  }

  &__bar-info {
    font-size: 14px;
    line-height: 18px;
  }

  &__bar {
    height: 6px;
    background-color: #f5f5f5;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
  }

  &__bar-value {
    height: 100%;
    background-color: #ffc600;
    position: absolute;
    left: 0;
    top: 0;
    transition: width .4s ease;
  }

  &__level {
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #c0ffeb;
    color: #212121;
    font-size: 20px;
    font-weight: 600;
    border-radius: 50%;
    flex-shrink: 0;
    margin-left: 30px;
  }
}
</style>
