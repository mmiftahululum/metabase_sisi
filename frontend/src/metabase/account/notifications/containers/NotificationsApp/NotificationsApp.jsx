import { connect } from "react-redux";
import _ from "underscore";
import Alerts from "metabase/entities/alerts";
import Pulses from "metabase/entities/pulses";
import { getUser, getUserId } from "metabase/selectors/user";
import {
  navigateToArchive,
  navigateToHelp,
  navigateToUnsubscribe,
} from "../../actions";
import { getNotifications } from "../../selectors";
import NotificationList from "../../components/NotificationList";

const mapStateToProps = (state, props) => ({
  user: getUser(state),
  items: getNotifications(props),
});

const mapDispatchToProps = {
  onHelp: navigateToHelp,
  onUnsubscribe: navigateToUnsubscribe,
  onArchive: navigateToArchive,
};

export default _.compose(
  Alerts.loadList({
    query: state => ({ user_id: getUserId(state) }),
    reload: true,
  }),
  Pulses.loadList({
    query: state => ({ user_id: getUserId(state) }),
    reload: true,
  }),
  connect(mapStateToProps, mapDispatchToProps),
)(NotificationList);
