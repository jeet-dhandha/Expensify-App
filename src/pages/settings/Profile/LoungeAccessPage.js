import React from 'react';
import {View} from 'react-native';
import _ from 'underscore';
import lodashGet from 'lodash/get';
import {withOnyx} from 'react-native-onyx';
import Navigation from '../../../libs/Navigation/Navigation';
import ROUTES from '../../../ROUTES';
import * as Illustrations from '../../../components/Icon/Illustrations';
import ONYXKEYS from '../../../ONYXKEYS';
import userPropTypes from '../userPropTypes';
import FullPageNotFoundView from '../../../components/BlockingViews/FullPageNotFoundView';
import useLocalize from '../../../hooks/useLocalize';
import FeatureList from '../../../components/FeatureList';
import IllustratedHeaderPageLayout from '../../../components/IllustratedHeaderPageLayout';
import * as LottieAnimations from '../../../components/LottieAnimations';
import * as UserUtils from '../../../libs/UserUtils';
import IllustrationFadeBackground from '../../../../assets/images/illustration-fade-gradient.svg';
import CONST from '../../../CONST';
import styles from '../../../styles/styles';
import compose from '../../../libs/compose';
import Text from '../../../components/Text';
import CurrentUserPersonalDetailsSkeletonView from '../../../components/CurrentUserPersonalDetailsSkeletonView';
import withCurrentUserPersonalDetails, {withCurrentUserPersonalDetailsDefaultProps, withCurrentUserPersonalDetailsPropTypes} from '../../../components/withCurrentUserPersonalDetails';
import PressableWithoutFeedback from '../../../components/Pressable/PressableWithoutFeedback';
import OfflineWithFeedback from '../../../components/OfflineWithFeedback';
import Avatar from '../../../components/Avatar';
import Tooltip from '../../../components/Tooltip';

const propTypes = {
    /** Current user details, which will hold whether or not they have Lounge Access */
    user: userPropTypes,
    ...withCurrentUserPersonalDetailsPropTypes,
};

const defaultProps = {
    user: {},
    ...withCurrentUserPersonalDetailsDefaultProps,
};

const menuItems = [
    {
        translationKey: 'loungeAccessPage.coffeePromo',
        icon: Illustrations.CoffeeMug,
    },
    {
        translationKey: 'loungeAccessPage.networkingPromo',
        icon: Illustrations.ChatBubbles,
    },
    {
        translationKey: 'loungeAccessPage.viewsPromo',
        icon: Illustrations.SanFrancisco,
    },
];

function LoungeAccessPage(props) {
    const {translate, formatPhoneNumber} = useLocalize();
    const {user, currentUserPersonalDetails, session} = props;
    if (!user.hasLoungeAccess) {
        return <FullPageNotFoundView shouldShow />;
    }

    const profileView = () => (
        <View style={{position: 'absolute', top: -120, left: 0, right: 0}}>
            {_.isEmpty(currentUserPersonalDetails) || _.isUndefined(currentUserPersonalDetails.displayName) ? (
                <CurrentUserPersonalDetailsSkeletonView />
            ) : (
                <View style={styles.avatarSectionWrapper}>
                    <Tooltip text={translate('common.profile')}>
                        <PressableWithoutFeedback
                            style={[styles.mb3]}
                            accessibilityLabel={translate('common.profile')}
                            accessibilityRole={CONST.ACCESSIBILITY_ROLE.BUTTON}
                        >
                            <OfflineWithFeedback pendingAction={lodashGet(currentUserPersonalDetails, 'pendingFields.avatar', null)}>
                                <Avatar
                                    imageStyles={[styles.avatarLarge]}
                                    source={UserUtils.getAvatar(currentUserPersonalDetails.avatar, session.accountID)}
                                    size={CONST.AVATAR_SIZE.LARGE}
                                />
                            </OfflineWithFeedback>
                        </PressableWithoutFeedback>
                    </Tooltip>
                    <PressableWithoutFeedback
                        style={[styles.mt1, styles.mw100]}
                        accessibilityLabel={translate('common.profile')}
                        accessibilityRole={CONST.ACCESSIBILITY_ROLE.LINK}
                    >
                        <Tooltip text={translate('common.profile')}>
                            <Text
                                style={[styles.textHeadline, styles.pre]}
                                numberOfLines={1}
                            >
                                {currentUserPersonalDetails.displayName ? currentUserPersonalDetails.displayName : props.formatPhoneNumber(session.email)}
                            </Text>
                        </Tooltip>
                    </PressableWithoutFeedback>
                    {Boolean(currentUserPersonalDetails.displayName) && (
                        <Text
                            style={[styles.textLabelSupporting, styles.mt1]}
                            numberOfLines={1}
                        >
                            {formatPhoneNumber(session.email)}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );

    return (
        <IllustratedHeaderPageLayout
            title={translate('loungeAccessPage.loungeAccess')}
            onBackButtonPress={() => Navigation.goBack(ROUTES.SETTINGS)}
            illustration={LottieAnimations.ExpensifyLounge}
        >
            <View style={[styles.signInPageGradientMobile, {transform: [{translateY: -300}]}]}>
                <IllustrationFadeBackground height="100%" />
            </View>
            <View style={[styles.mb4]}>{profileView()}</View>
            <View style={[styles.mt11]}>
                <FeatureList
                    headline="loungeAccessPage.headline"
                    description="loungeAccessPage.description"
                    menuItems={menuItems}
                />
            </View>
        </IllustratedHeaderPageLayout>
    );
}

LoungeAccessPage.propTypes = propTypes;
LoungeAccessPage.defaultProps = defaultProps;
LoungeAccessPage.displayName = 'LoungeAccessPage';

export default compose(
    withCurrentUserPersonalDetails,
    withOnyx({
        user: {
            key: ONYXKEYS.USER,
        },
        session: {
            key: ONYXKEYS.SESSION,
        },
    }),
)(LoungeAccessPage);
