<template>
    <div class="find-specialist-container only-back-container page-body-container standard-width">
        <div class="">

            <div class="specialist-section find-specialist-container-section block-section survey-flex">
                <back-navigation />

                <div class="heading-icon">
                    <img src="../../assets/images/speciality.svg" alt="speciality-icon" />
                </div>
                <div class="survey-container">
                    <div class="heading-title">
                        {{ $t("symptoms.survey") }}
                    </div>
                    <div class="heading-subTitle">
                    {{ $t("symptoms.surveyDetail") }}
                </div>
                </div>
            </div>
        </div>
        <div class="body-section">
            <h3 class="yesOrNo-sub-title pb-3">
                {{ $t("symptoms.verifyUserPackage") }}
            </h3>
            <div class="yesOrNo-container">
                <div class="yesOrNo" v-for="yesOrNo in confirmation" :key="'find-speciality-' + yesOrNo.id"
                    @click="setSelectedyesOrNo(yesOrNo)" :class="{ active: yesOrNo.status }">
                    <div class="yesOrNo-label">
                        {{ yesOrNo[getLocaleKey("label")] }}
                    </div>
                    <!-- <div class="yesOrNo-img">
                    <img :src="getImageUrl(yesOrNo.img)" alt="icon" />
                </div> -->
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            confirmation: [
                {
                    id: "1",
                    img: require("../../assets/images/male.svg"),
                    label: "Yes",
                    label_ar: "نعم",
                    status: false,
                },
                {
                    id: "2",
                    img: require("../../assets/images/male.svg"),
                    label: "No",
                    label_ar: "لا",
                    status: false,
                },
            ]
        }
    },
    methods: {
        ...mapActions('symptoms', ["updateSurvey"]),
        setSelectedyesOrNo(yesOrNo) {
            if (yesOrNo.label === "Yes") {
                // Fetch user data from sessionStorage
                const userData = JSON.parse(sessionStorage.getItem("userInfo"));
                if (userData) {
                    const dob = userData.dob;
                    this.updateSurvey({ age: this.getYears(dob) });
                    this.updateSurvey({ gender: userData.gender });
                    this.$router.push({ name: "Symptom Checker" });
                } else {
                    // console.error("User data not found in sessionStorage");
                }
            }
            this.updateSurvey({ survey: yesOrNo.label.toLowerCase() });

            if (yesOrNo.label === "No") {
                this.updateSurvey({ gender: null });
                this.updateSurvey({ age: null });
                this.$router.push({ name: "Symptom Checker" });
            }
            this.updateSurvey({ survey: yesOrNo.label.toLowerCase() });

        },
    },
}

</script>

<style lang="scss" scoped>
.yesOrNo-sub-title {
    font-size: 1.3rem;
}

.yesOrNo-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}



.yesOrNo {
    border: 1px solid rgb(217, 214, 214);
    width: 12rem;
    height: 12rem;
    padding: 1.2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    cursor: pointer;
    border-radius: 1rem;
    background-color: var(--theme-tertiary);
    color: var(--theme-default);
}

.active {
    background: #e0e2e4;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.yesOrNo-img {
    width: 100%;
    text-align: center;
}

.yesOrNo-label {
    font-size: 1rem;
    font-weight: 400 !important;
    text-align: center;
}

.only-back-container .back-navigation {
    position: static;
}

.survey-flex {
    display: flex;
    gap: 1rem;
    align-items: center;
}
</style>